const Question = require("../../models/readingToiec.model");
const IELTSQuestion = require("../../models/ielts.model"); // Đảm bảo bạn đã có model này

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
