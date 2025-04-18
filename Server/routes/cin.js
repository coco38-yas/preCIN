import { Router } from 'express';
const router = Router();
import multer, { diskStorage } from 'multer';
import path from 'path';
import * as cinController from '../controllers/cinController.js';
// const { verifyToken, isAdmin } = require('../middleware/auth');

// Configuration de Multer pour l'upload d'images
const storage = diskStorage({
  destination: (req, file, cb) => { 
    cb(null, './uploads/'); 
  },
  filename: (req, file, cb) => { 
    cb(null, Date.now() + '-' + file.originalname); 
  }
});
const upload = multer({ storage });

// Route de création d'une carte 
router.post('/', upload.single('image'), cinController.createCin );

// Endpoints de lecture, mise à jour, suppression
router.get('/', cinController.getCin);
router.get('/:id', cinController.getCindById);
router.put('/:id', upload.single('image'), cinController.updateCin);
// Route pour confirmer une carte (mise à jour de la colonne commune_i à 1)
router.patch('/confirm/:id', cinController.confirmCard);
// Ajout de l'endpoint PATCH pour la mise à jour partielle (ex: soft-delete/restauration)
router.patch('/:id', cinController.patchCin);

router.delete('/:id', cinController.deleteCin);
// router.get('/dashboard', cinController.getDashboard )
export default router;
