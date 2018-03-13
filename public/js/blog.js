$(document).ready(function() {
  /* global moment */

  // blogContainer holds all of our posts
  var blogContainer = $(".blog-container");
  var postCategorySelect = $("#category");
  var postDomainSelect = $("#domain");  
  // Click events for the edit and delete buttons
  $(document).on("click", "button.selectBoth", handleBoth);
  $(document).on("click", "button.delete", handlePostDelete);
  $(document).on("click", "button.edit", handlePostEdit);
  postCategorySelect.on("change", handleCategoryChange);
  postDomainSelect.on("change", handleDomainChange);  
  // Variable to hold our posts
  var posts;

  // The code below handles the case where we want to get blog posts for a specific author
  // Looks for a query param in the url for author_id
  var url = window.location.search;
  var authorId;
  if (url.indexOf("?author_id=") !== -1) {
    authorId = url.split("=")[1];
    getPosts(authorId);
  }
  // If there's no authorId we just get all posts as usual
  else {
    getPosts();
  }


  // This function grabs posts from the database and updates the view
  function getPosts(author) {
    authorId = author || "";
    if (authorId) {
      authorId = "/?author_id=" + authorId;
    }
    $.get("/api/posts" + authorId, function(data) {
      console.log("Posts", data);
      posts = data;
      if (!posts || !posts.length) {
        displayEmpty(author);
      }
      else {
        initializeRows(authorId);
      }
    });
  }

    // This function grabs posts from the database and updates the view
  function getCatPosts(category) {
    var categoryString = category || "";
    if (categoryString) {
      categoryString = "/category/" + categoryString;
    }
    $.get("/api/posts" + categoryString, function(data) {
      console.log("Posts", data);
      posts = data;
      if (!posts || !posts.length) {
        displayCatEmpty();
      }
      else {
        initializeRows();
      }
    });
  }

function getCatDomPosts(category, domain) {
    var domainString = domain || "";
    var categoryString = category || "";
    if (domainString) {
      domainString = "/both/" + categoryString + "/" + domainString;
    }
    $.get("/api/posts" + domainString, function(data) {
      console.log("Posts", data);
      posts = data;
      if (!posts || !posts.length) {
        displayCatDomEmpty();
      }
      else {
        initializeRows();
      }
    });
  }  

    // This function grabs posts from the database and updates the view
  function getDomPosts(domain) {
    var domainString = domain || "";
    if (domainString) {
      domainString = "/domain/" + domainString;
    }
    $.get("/api/posts" + domainString, function(data) {
      console.log("Posts", data);
      posts = data;
      if (!posts || !posts.length) {
        displayDomEmpty();
      }
      else {
        initializeRows();
      }
    });
  }

  // This function does an API call to delete posts
  function deletePost(id) {
    $.ajax({
      method: "DELETE",
      url: "/api/posts/" + id
    })
      .then(function() {
        getPosts(postCategorySelect.val());
      });
  }

  // InitializeRows handles appending all of our constructed post HTML inside blogContainer
  function initializeRows(authored) {
    authored = authorId;
    blogContainer.empty();
    var postsToAdd = [];
    for (var i = 0; i < posts.length; i++) {
      postsToAdd.push(createNewRow(posts[i], authored));
    }
    blogContainer.append(postsToAdd);
  }

  // This function constructs a post's HTML
  function createNewRow(post, authored) {
    authored = authorId;
    var formattedDate = new Date(post.createdAt);
    formattedDate = moment(formattedDate).format("MMMM Do YYYY, h:mm:ss a");
    var newPostPanel = $("<div>");
    newPostPanel.addClass("panel panel-default");
    var newPostPanelHeading = $("<div>");
    newPostPanelHeading.addClass("panel-heading");
    var newPostTitle = $("<h2>");
    var newPostDate = $("<small>");
    // var newPostAuthor = $("<h5>");
    // newPostAuthor.text("  " + post.Author.name);
    // newPostAuthor.css({
    //   float: "right",
    //   color: "blue",
    //   "margin-top":
    //   "-10px"
    // });
    var newPostCategory = $("<h5>");
    newPostCategory.text(post.category + " : " + post.domain);
    newPostCategory.css({
      float: "right",
      "font-weight": "700",
      "margin-top":
      "-15px"
    });
    var newPostPanelBody = $("<div>");
    newPostPanelBody.addClass("panel-body");
    var newPostBody = $("<p>");
    newPostTitle.text(post.title + " ");
    newPostBody.text(post.body);
    newPostDate.text(formattedDate);
    newPostTitle.append(newPostDate);

    if (authored) {
    var deleteBtn = $("<button>");
    deleteBtn.text("x");
    deleteBtn.addClass("delete btn btn-danger");
    var editBtn = $("<button>");
    editBtn.text("EDIT");
    editBtn.addClass("edit btn btn-info");
    newPostPanelHeading.append(deleteBtn);
    newPostPanelHeading.append(editBtn);          
    }    

    newPostPanelHeading.append(newPostTitle);
    // newPostPanelHeading.append(newPostAuthor);
    newPostPanelHeading.append(newPostCategory);
    newPostPanelBody.append(newPostBody);
    newPostPanel.append(newPostPanelHeading);
    newPostPanel.append(newPostPanelBody);
    newPostPanel.data("post", post);
    return newPostPanel;
  }

  // This function figures out which post we want to delete and then calls deletePost
  function handlePostDelete() {
    var currentPost = $(this)
      .parent()
      .parent()
      .data("post");
    deletePost(currentPost.id);
  }

  // This function figures out which post we want to edit and takes it to the appropriate url
  function handlePostEdit() {
    var currentPost = $(this)
      .parent()
      .parent()
      .data("post");
    window.location.href = "/ams?post_id=" + currentPost.id;
  }

  // This function displays a messgae when there are no posts
  function displayEmpty(id) {
    var query = window.location.search;
    var partial = "";
    if (id) {
      partial = " for Author #" + id;
    }
    blogContainer.empty();
    var messageh2 = $("<h2>");
    messageh2.css({ "text-align": "center", "margin-top": "50px" });
    messageh2.html("No posts yet" + partial + ", navigate <a href='/ams" + query +
    "'>here</a> in order to get started.");
    blogContainer.append(messageh2);
  }

    function displayCatEmpty() {
    blogContainer.empty();
    var messageh2 = $("<h2>");
    messageh2.css({ "text-align": "center", "margin-top": "50px" });
    messageh2.html("No posts yet for this category, navigate <a href='/ams'>here</a> in order to create a new post.");
    blogContainer.append(messageh2);
  }

  // This function handles reloading new posts when the category changes
  function handleCategoryChange() {
    var newPostCategory = $(this).val();
    getCatPosts(newPostCategory);
  }

    function displayDomEmpty() {
    blogContainer.empty();
    var messageh2 = $("<h2>");
    messageh2.css({ "text-align": "center", "margin-top": "50px" });
    messageh2.html("No posts yet for this domain, navigate <a href='/ams'>here</a> in order to create a new post.");
    blogContainer.append(messageh2);
  }

  // This function handles reloading new posts when the category changes
  function handleDomainChange() {
    var newPostDomain = $(this).val();
    getDomPosts(newPostDomain);
  }

  function handleBoth() {
    var newPostCategory = postCategorySelect.val();   
    var newPostDomain = postDomainSelect.val();  
    console.log(newPostDomain);
    console.log(newPostCategory);
    getCatDomPosts(newPostCategory, newPostDomain);
  }

      function displayCatDomEmpty() {
    blogContainer.empty();
    var messageh2 = $("<h2>");
    messageh2.css({ "text-align": "center", "margin-top": "50px" });
    messageh2.html("No posts yet for this age and domain, navigate <a href='/ams'>here</a> in order to create a new post.");
    blogContainer.append(messageh2);
  }

});
