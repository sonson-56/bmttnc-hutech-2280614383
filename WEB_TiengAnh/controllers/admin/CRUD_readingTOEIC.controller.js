const Question = require("../../models/readingToiec.model");
const upload = require('../../middlewares/upload.middleware');

// Lấy danh sách câu hỏi
exports.getAllQuestions = async (req, res) => {
    try {
        const questions = await Question.find().lean();
        res.render("questions", { questions });
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

// Hiển thị form thêm câu hỏi
exports.showCreateForm = (req, res) => {
    res.render("admin/pages/create-question");
};

// Xử lý thêm câu hỏi
exports.createQuestion = async (req, res) => {
    try {
        const { MaCC, TopicN, part, question, options, correctAnswer, explanation } = req.body;

        // Kiểm tra các trường bắt buộc
        if (!MaCC || !TopicN || !part || !question || !options || !correctAnswer || !explanation) {
            return res.status(400).send("Vui lòng điền đầy đủ tất cả các trường bắt buộc.");
        }

        const imagePath = req.file ? "/admin/img/uploads_reading_TOEIC/" + req.file.filename : null;

        const newQuestion = new Question({
            MaCC,
            TopicN,
            part,
            question,
            options,
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
