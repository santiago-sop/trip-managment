import multer from 'multer';

//Donde se van a guardar los archivos que se suban
const storage = multer.diskStorage({
    // Donde se guardan los archivos
    destination:function(req, file, cb) {
        cb(null, './src/public/uploads/');
    },

    //Con que nombre se guardan los archivos
    filename: function(req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
})

// Configuración de multer
const uploaders = multer({
    storage: storage,
    limits: { fileSize: 1000000 }, // Limite de 1MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Tipo de archivo no permitido'), false);
        }
    }
});

export default uploaders;