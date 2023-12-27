const formidable = require('formidable')
const path = require('path');
const fs = require('fs');
const response = require('../help/response')
const message = require('../help/message')


exports.upload = async (req, res, next) => {

    const form = new formidable.IncomingForm();
    form.uploadDir = path.join(__dirname, '/uploads');
    form.parse(req, (err, fields, files) => {
        if (err) {
            console.error(err);
            response.errorResponse(res, message.ERROR_PARSING_THE_FORM)
            return;
        }
        files.first.map(async(item) => {
            const oldP= item.filepath
            const newP= path.join(form.uploadDir, item.originalFilename);
            fs.rename(oldP, newP, (rE) => {
                if (rE) {
                    console.error(rE);
                    res.status(500).json({ error: 'Error moving the file to the upload directory' });
                    return;
                }
            })
        })  
        console.log(fields)
        req.body = fields;
        next();
    })
}