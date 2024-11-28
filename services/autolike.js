const Blog = require("../models/dashmodel/blogs");

function generateRandomLikes() {
    return Math.floor(Math.random() * 10) + 1; // Generates a number between 1 and 10
}

// Function to add random likes to all blogs
async function addRandomLikesToBlogs() {
    try {
        const blogs = await Blog.find();
        const maxTotalLikes = 500; // Cap total likes for each blog

        for (const blog of blogs) {
            const likesToAdd = generateRandomLikes();

            // Add likes only if it keeps the blog’s like count under the maximum cap
            if (blog.likes + likesToAdd <= maxTotalLikes) {
                blog.likes += likesToAdd;
                await blog.save();
                console.log(`Added ${likesToAdd} likes to blog titled "${blog.title}"`);
            }
        }

        console.log('Random likes added to all blogs successfully!');
    } catch (error) {
        console.error('Error adding random likes to blogs:', error);
    }
}

module.exports = { addRandomLikesToBlogs };