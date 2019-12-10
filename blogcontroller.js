

function Blogger(blog, mongoose)
{
    var blogSchema = new mongoose.Schema({
        userID: String,
        userName: String,
        blogContent: String,
        blogID: String
    });

    var blogModel = mongoose.model('blogs', blogSchema);

    console.log("Blogger Server Started");

    blog.get("/CreateBlogPost/:userID/:userName/:content", function(req, res)
    {
        var userID = req.params.userID;
        var userName = req.params.userName;
        var content = req.params.content;


        var post = new blogModel({

            "userID": userID,
            "userName": userName,
            "blogContent": content
        });
        
        post.blogID = post._id;
        post.save(function (err) { if (err) console.log('Error on save!') });

        res.send({post});
    });

    blog.get("/listAllBlogPosts", function (req, res) { //LISTS ALL Blogs IN THE DATABASE
        
        blogModel.find(function (err, blog) {
            
            if (err) return console.error(err);
            
            console.log(blog);
            
            res.send({ blog });
        });
    });

    blog.get("/ClearAllBlogs", function (req, res) { //BIG RED BUTTON

        blogModel.remove({}, function (err) {
            console.log('Blogs DataBase Wiped')
    
            var string = "Blogs DataBase Wiped";
        
            res.send(string.toString());
        });
    
    });

}

module.exports = Blogger;