function JobPosting(job, mongoose)
{
    var jobSchema = new mongoose.Schema({
        jobTitle: String,
        jobDepartment: String,
        jobProperty: String,
        jobID: String
    });

    var jobModel = mongoose.model('jobs', jobSchema);

    console.log("Job Server Started");

    job.get("/jobPage", function(req, res)
    {
        res.sendFile(__dirname+"/jobPage.html");
    });

    job.get("/CreateJobPost/:jobTitle/:jobDepartment/:jobProperty", function(req, res)
    {
        var jobTitle = req.params.jobTitle;
        var jobDepartment = req.params.jobDepartment;
        var jobProperty = req.params.jobProperty;


        var post = new jobModel({

            "jobTitle": jobTitle,
            "jobDepartment": jobDepartment,
            "jobProperty": jobProperty
        });
        
        post.jobID = post._id;
        post.save(function (err) { if (err) console.log('Error on save!') });

        res.send({post});
    });

    job.get("/GetEveryJob", function(req, res)
    {
        jobSchema.listCollections()
    });

    job.post("/WebsiteJobPost", function(req, res)
    {
        var jobTitle = req.body.jobTitle;
        var jobDepartment = req.body.jobDepartment;
        var jobProperty = req.body.jobProperty;


        var post = new jobModel({

            "jobTitle": jobTitle,
            "jobDepartment": jobDepartment,
            "jobProperty": jobProperty
        });
        
        post.jobID = post._id;
        post.save(function (err) { if (err) console.log('Error on save!') });

        res.sendFile(__dirname+"/jobPosted.html");
    });

    job.get("/listAllJobs", function (req, res) { //LISTS ALL Awards IN THE DATABASE
        
        jobModel.find(function (err, job) {
            
            if (err) return console.error(err);
            
            console.log(job);
            
            res.send({ job });
        });
    });

    job.get("/ClearAllJobs", function (req, res) { //BIG RED BUTTON

        jobModel.remove({}, function (err) {
            console.log('Jobs DataBase Wiped')
    
            var string = "Jobs DataBase Wiped";
        
            res.send(string.toString());
        });
    
    });

}

module.exports = JobPosting;