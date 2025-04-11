const Question = require("../../models/TOEIC/readingToiec.model");
const upload = require('../../middlewares/upload.middleware');
const Exam = require("../../models/TOEIC/exam.model");
// Lấy danh sách câu hỏi
exports.getAllQuestions = async (req, res) => {
    try {
        const questions = await Question.find().lean();
        res.render("admin/pages/TOEIC/dashboard-questionTOEIC", { questions });
    } catch (error) {
        console.error(error);
        res.status(500).send("Lỗi lấy danh sách câu hỏi");
    }
};

// Trang dashboard admin
exports.getDashboard = async (req, res) => {
    try {
        const questions = await Question.find();
        res.render("admin/pages/dashboard", { questions });
    } catch (error) {
        console.error(error);
        res.status(500).send("Lỗi server");
    }
};
exports.getDashboard_TOEIC = async (req, res) => {
    try {
        const questions = await Question.find();
        res.render("admin/pages/TOEIC/dashboard_TOEIC", { questions });
    } catch (error) {
        console.error(error);
        res.status(500).send("Lỗi server");
    }
};

// Hiển thị form thêm câu hỏi
exports.showCreateForm = (req, res) => {
    res.render("admin/pages/TOEIC/create-question");
};
exports.showCreateFormExam = (req, res) => {
    try {
        res.render("admin/pages/TOEIC/create-exam");
    } catch (error) {
        console.error(error);
        res.status(500).send("Lỗi khi tải trang tạo đề");
    }
};
// Xử lý thêm câu hỏi
exports.createQuestion = async (req, res) => {
    try {
        const {
            MaCC,
            TopicN,
            part,
            questionN,
            question,
            options,
            correctAnswer,
            explanation
        } = req.body;

        // Kiểm tra các trường bắt buộc
        if (!MaCC || !TopicN || !part || !questionN || !question || !options || !correctAnswer) {
            return res.status(400).send("Vui lòng điền đầy đủ các trường bắt buộc.");
        }

        // Kiểm tra các trường số
        if (isNaN(TopicN) || isNaN(part) || isNaN(questionN)) {
            return res.status(400).send("Các trường số phải là giá trị hợp lệ.");
        }

        // Ép kiểu nếu chỉ có 1 option
        const optionsArray = Array.isArray(options) ? options : [options];

        const imagePath = req.file
            ? "/admin/img/uploads_reading_TOEIC/" + req.file.filename
            : null;

        const newQuestion = new Question({
            MaCC,
            TopicN: Number(TopicN),
            part: Number(part),
            questionN: Number(questionN),
            question,
            options: optionsArray,
            correctAnswer,
            explanation,
            Img: imagePath
        });

        await newQuestion.save();
        res.redirect("/admin/dashboard");
    } catch (error) {
        console.error(error);
        res.status(500).send("Lỗi tạo câu hỏi");
    }
};


// Ramdom exam generation
// Lọc câu hỏi theo độ khó (Dễ/Trung bình/Kho)
exports. generateRandomExam = async (req, res) => {
    try {
        const { parts, difficulty, questionCount, minTopic, maxTopic } = req.body;

        // Validate input
        if (!parts || !difficulty || !questionCount) {
            return res.status(400).json({ error: "Vui lòng điền đầy đủ thông tin bắt buộc" });
        }

        // Convert parts to array of numbers
        const partsArray = Array.isArray(parts) 
            ? parts.map(Number) 
            : [Number(parts)];

        // Build query
        const query = {
            part: { $in: partsArray },
            difficulty: Number(difficulty)
        };

        // Add topic range if provided
        if (minTopic && maxTopic) {
            query.TopicN = { 
                $gte: Number(minTopic), 
                $lte: Number(maxTopic) 
            };
        }

        // Get all questions matching criteria
        const allQuestions = await Question.find(query).lean();

        // Check if enough questions available
        if (allQuestions.length < questionCount) {
            return res.status(400).json({ 
                error: `Chỉ có ${allQuestions.length} câu hỏi phù hợp trong database (yêu cầu: ${questionCount})` 
            });
        }

        // Shuffle and select random questions
        const shuffled = allQuestions.sort(() => 0.5 - Math.random());
        const selectedQuestions = shuffled.slice(0, questionCount);

        // Generate exam code
        const examCode = `RND-${partsArray.join('')}-${Date.now().toString().slice(-4)}`;

        // Create exam document (you may need to create a new Exam model)
        const newExam = new Exam({
            examCode,
            questions: selectedQuestions.map(q => q._id),
            parts: partsArray,
            difficulty: Number(difficulty),
            questionCount: Number(questionCount),
            createdBy: req.user._id // Assuming you have user authentication
        });

        await newExam.save();

        // Return success with exam data
        res.json({
            success: true,
            examId: newExam._id,
            examCode,
            questionCount: selectedQuestions.length,
            parts: partsArray,
            difficulty: ['Dễ', 'Trung bình', 'Khó'][difficulty]
        });

    } catch (error) {
        console.error("Error generating random exam:", error);
        res.status(500).json({ error: "Lỗi server khi tạo đề ngẫu nhiên" });
    }
};



// Lấy danh sách tất cả đề thi
exports.getAllExams = async (req, res) => {
    try {
        const exams = await Exam.find()
            .sort({ createdAt: -1 })
            .populate('questions')
            .lean();
            
        res.render("admin/pages/TOEIC/exam-list", { 
            exams,
            examStatus: {
                0: "Draft",
                1: "Published",
                2: "Archived"
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Lỗi khi lấy danh sách đề thi");
    }
};

// Xem chi tiết đề thi
exports.getExamDetail = async (req, res) => {
    try {
        const exam = await Exam.findById(req.params.id)
            .populate({
                path: 'questions',
                select: 'MaCC part questionN question options correctAnswer'
            })
            .lean();

        if (!exam) {
            return res.status(404).send("Không tìm thấy đề thi");
        }

        // Nhóm câu hỏi theo Part
        const questionsByPart = {};
        exam.questions.forEach(q => {
            if (!questionsByPart[`Part ${q.part}`]) {
                questionsByPart[`Part ${q.part}`] = [];
            }
            questionsByPart[`Part ${q.part}`].push(q);
        });

        res.render("admin/pages/TOEIC/exam-detail", { 
            exam,
            questionsByPart,
            difficultyMap: {
                0: "Dễ",
                1: "Trung bình",
                2: "Khó"
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Lỗi khi lấy chi tiết đề thi");
    }
};



exports.showEditForm = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id).lean();
        if (!question) {
            return res.status(404).send("Không tìm thấy câu hỏi");
        }
        res.render("admin/pages/TOEIC/edit-question", { question });
    } catch (error) {
        console.error(error);
        res.status(500).send("Lỗi khi tải form chỉnh sửa");
    }
};

exports.updateQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            MaCC,
            TopicN,
            part,
            questionN,
            question,
            options,
            correctAnswer,
            explanation
        } = req.body;

        // Kiểm tra câu hỏi tồn tại
        const existingQuestion = await Question.findById(id);
        if (!existingQuestion) {
            return res.status(404).send("Không tìm thấy câu hỏi");
        }

        // Cập nhật dữ liệu
        existingQuestion.MaCC = MaCC;
        existingQuestion.TopicN = Number(TopicN);
        existingQuestion.part = Number(part);
        existingQuestion.questionN = Number(questionN);
        existingQuestion.question = question;
        existingQuestion.options = Array.isArray(options) ? options : [options];
        existingQuestion.correctAnswer = correctAnswer;
        existingQuestion.explanation = explanation;

        // Cập nhật ảnh nếu có
        if (req.file) {
            existingQuestion.Img = "/admin/img/uploads_reading_TOEIC/" + req.file.filename;
        }

        await existingQuestion.save();
        res.redirect("/admin/dashboard");
    } catch (error) {
        console.error(error);
        res.status(500).send("Lỗi khi cập nhật câu hỏi");
    }
};


exports.getQuestionsByPart = async (req, res) => {
    try {
        const { part } = req.params;
        const questions = await Question.find({ part: Number(part) }).lean(); // Ép kiểu số vì part trong schema là Number
        res.render("admin/pages/TOEIC/questions-by-part", { 
            questions,
            currentPart: part,
            partNames: { 5: "Part 5", 6: "Part 6", 7: "Part 7" } // Đặt tên hiển thị
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Lỗi khi lọc câu hỏi theo Part");
    }
};


// Hiển thị form tìm kiếm
exports.showSearchForm = (req, res) => {
    res.render("search-question", { questions: null });
};

// Xử lý tìm kiếm
exports.searchQuestions = async (req, res) => {
    try {
        const { keyword } = req.query;
        const questions = await Question.find({
            $or: [
                { MaCC: { $regex: keyword, $options: "i" } },
                { question: { $regex: keyword, $options: "i" } },
                { correctAnswer: { $regex: keyword, $options: "i" } }
            ]
        }).lean();
        res.render("search-question", { questions });
    } catch (error) {
        console.error(error);
        res.status(500).send("Lỗi tìm kiếm câu hỏi");
    }
};

// Xóa một câu hỏi
exports.deleteQuestion = async (req, res) => {
    try {
        await Question.findByIdAndDelete(req.params.id);
        res.redirect("/admin/dashboard");
    } catch (error) {
        res.status(500).send("Lỗi xóa câu hỏi");
    }
};

// Xóa một đề thi
exports.deleteExam = async (req, res) => {
    try {
        const exam = await Exam.findByIdAndDelete(req.params.id);
        if (!exam) {
            return res.status(404).json({ success: false, message: "Không tìm thấy đề thi" });
        }
        res.json({ success: true, message: "Đã xóa đề thi thành công" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Lỗi khi xóa đề thi" });
    }
};