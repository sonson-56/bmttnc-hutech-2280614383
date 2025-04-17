const Question = require("../../models/TOEIC/readingToiec.model"); // Đảm bảo bạn đã có model này
const IELTSQuestion = require("../../models/IELTS/readingIELTS.model"); // Đảm bảo bạn đã có model này

// Hiển thị trang dashboard chính với lựa chọn loại đề
module.exports.index = async (req, res) => {
    try {
        const toeicCount = await Question.countDocuments();
        const ieltsCount = await IELTSQuestion.countDocuments();

        res.render("admin/pages/dashboard", {
            stats: {
                toeicCount,
                ieltsCount
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).render("error");
    }
};

// Hiển thị danh sách câu hỏi theo loại đề
module.exports.showQuestions = async (req, res) => {
    try {
        const { type } = req.query;

        if (type === 'toeic') {
            const questions = await Question.find().sort({ TopicN: 1, questionN: 1 });
            return res.render("admin/pages/questions/list", {
                questions,
                questionType: 'TOEIC'
            });
        }

        if (type === 'ielts') {
            const questions = await IELTSQuestion.find().sort({ TopicN: 1, questionN: 1 });
            return res.render("admin/pages/questions/list", {
                questions,
                questionType: 'IELTS'
            });
        }

        // Nếu không có type hoặc type không hợp lệ
        res.redirect("/admin/dashboard");
    } catch (error) {
        console.error(error);
        res.status(500).render("error");
    }
};
module.exports.getDashboard_TOEIC = (req, res) => {
    res.render("admin/pages/TOEIC/dashboard_TOEIC", {
        title: "Dashboard TOEIC",
        user: req.user,
    });
};

module.exports.redirectExamType = (req, res) => {
    const { examType } = req.params;
    res.send(`Redirect to ${examType}`);
};
