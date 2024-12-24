const express = require('express');
const { getAllJobs, getAllJobsByMe, getSingleJob, createJob, updateJob, deleteJob } = require('./../controllers/jobsController');

const { authenticate } = require('./../middleware/authentication')

const router = express.Router();

router.use(authenticate)

router.route('/').get(getAllJobs).post(createJob)
router.get('/myJobs', getAllJobsByMe)
router.route('/:jobId').get(getSingleJob).patch(updateJob).delete(deleteJob)


module.exports = router

