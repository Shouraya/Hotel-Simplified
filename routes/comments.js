

// ================
// COMMENTS ROUTES
// ================

app.get("/hotels/:id/comments/new", isLoggedIn, function(req, res){
    // find campground by id
    Hotel.findById(req.params.id, function(err, hotel){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {hotel: hotel});
        }
    })
});

app.post("/hotels/:id/comments", isLoggedIn, function(req, res){
   //lookup campground using ID
   Hotel.findById(req.params.id, function(err, hotel){
       if(err){
           console.log(err);
           res.redirect("/hotels");
       } else {
            //create new comment
            Comment.create(req.body.comment, function(err, comment){
            if(err){
                console.log(err);
            } else {
                //connect new comment to campground
                hotel.comments.push(comment);
                hotel.save();
                //redirect campground show page
                res.redirect('/hotels/' + hotel._id);
            }
            });
         }
   });
});