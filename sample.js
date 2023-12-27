const express = require('express');
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static('public'));
const port = 3000;




app.get('/',(req,res)=>{
    res.status(200).json({message:"OK"})
})


app.post('/upload', async(req, res) => {
    const form = new formidable.IncomingForm();

    // Set the upload directory
    form.uploadDir = path.join(__dirname, '/uploads');

    // Parse the form data
    form.parse(req, (err, fields, files) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Error parsing the form' });
            return;
        }
        files.first.map((item)=>{
            const oldPath = item.filepath
            const newPath = path.join(form.uploadDir, item.originalFilename);
            fs.rename(oldPath, newPath, (renameErr) => {
                if (renameErr) {
                    console.error(renameErr);
                    res.status(500).json({ error: 'Error moving the file to the upload directory' });
                    return;
                }
        })
    })
    res.status(201).json({ message: "File uploaded successfully!" ,data:files.first});
        

        // fs.rename(oldPath, newPath, (renameErr) => {
        //     if (renameErr) {
        //         console.error(renameErr);
        //         res.status(500).json({ error: 'Error moving the file to the upload directory' });
        //         return;
        //     }
        // res.status(200).json({ message: 'File successfully uploaded' });

        // });
    });
});



app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
