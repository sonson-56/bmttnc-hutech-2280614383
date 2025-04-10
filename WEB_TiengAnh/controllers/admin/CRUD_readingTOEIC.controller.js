const Question = require("../../models/TOEIC/readingToiec.model");
const upload = require('../../middlewares/upload.middleware');

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
