const { StatusCodes } = require("http-status-codes");
const Job = require("../models/Job");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllJobs = async (req, res) => {
  const jobs = await Job.find().sort('createdAt')
  res.status(StatusCodes.OK).json({ availableJobs: jobs.length, jobs});
};

const getAllJobsByMe = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userId }).sort('createdAt');
  res.status(StatusCodes.OK).json({ myJobs: jobs.length, jobs});
};


const getSingleJob = async (req, res) => {
  const job = await Job.findById(req.params.jobId); 

  if(!job){
    throw new NotFoundError('Job does not exist!');
  }
  
  res.status(StatusCodes.OK).json({ job });
};

const createJob = async (req, res) => {
  const { company, position, status } = req.body;

  if(!company || !position || !status){
    throw new BadRequestError('Please add company, position and status job!');
  }

  const job = await Job.create({ createdBy: req.user.userId, company, position, status });

  res.status(StatusCodes.CREATED).json({ job });
};



const updateJob = async (req, res) => {
  const { company, position } = req.body;
  const { userId } = req.user;
  const { jobId } = req.params;

  if (company === '' || position === '') {
    throw new BadRequestError('Company or Position fields cannot be empty!');
  }

  const job = await Job.findById(jobId);

  if (!job) {
    throw new NotFoundError('Job does not exist!');
  }

  if (job.createdBy.toString() !== userId) {
    throw new BadRequestError('You are not authorized to update this job!');
  }

  const updatedJob = await Job.findByIdAndUpdate(
    jobId,
    req.body,
    { new: true, runValidators: true }
  );

  res.status(StatusCodes.OK).json({ message: 'Job updated successfully!', job: updatedJob });
};




const deleteJob = async (req, res) => {
  const { jobId } = req.params;
  const { userId } = req.user;

    const job = await Job.findById(jobId);

    if (!job) {
      throw new NotFoundError('Job does not exist!');
    }

    if (job.createdBy.toString() !== userId) {
      throw new BadRequestError('You are not authorized to delete this job!');
    }

    await Job.findByIdAndDelete(jobId);

    res.status(StatusCodes.OK).json({ message: 'Job deleted successfully!' });
};

module.exports = { getAllJobs, getAllJobsByMe, getSingleJob, createJob, updateJob, deleteJob };
