/*
    home/
*/

const express = require('express');
const { Client } = require('pg');
const lodash = require('lodash');
const router = express.Router();

const { connectionString } = require("../config/keys");

/*
    any new post will not be shown
    lazy loading will be used for any posts that arent new at that time
    post_id is used to keep track of last post displayed in the page
    that post_id(of the last post on the page) will be passed as query string post_id=x
    x will then be used to get next post
    this will happen for user not logged in as it has no interest functionality
 
*/

//query string should have post_id of last post displayed, subforum_id of last subforum displayed
router.get('/', async(req, res) => { //query string -- post_id, subforum_id
    res.send('hello');
    console.log(req.query);
    const client = new Client({ connectionString: connectionString });

    try {
        await client.connect();
        console.log("connection successful!");

        // // for not logged in user
        // if (req.query) {
        //     var sql = "SELECT COUNT(*) FROM post ";
        //     sql += "WHERE post_id >= $1;";
        //     var params = [
        //         req.query.post_id
        //     ];
        //     var count_post = await client.query(sql, params);
        //     console.log(count_post.rows);

        //     sql = "SELECT * FROM post ";
        //     sql += "WHERE community_id IS NULL ";
        //     sql += "ORDER BY post_id DESC ";
        //     sql += "LIMIT 6 OFFSET $1;";
        //     params = [
        //         Number(count_post.rows[0].count)
        //     ];
        //     var post = await client.query(sql, params);
        //     var author_post = [];
        //     var subforum_name_post = [];
        //     var category_post = [];

        //     for (var i = 0; i < post.rows.length; i++) {
        //         sql1 = "SELECT username FROM users ";
        //         sql1 += "WHERE user_id = $1 ";
        //         var params1 = [Number(post.rows[0].author_id)];

        //         sql2 = "SELECT name FROM subforum ";
        //         sql2 += "WHERE subforum_id = $1 ";
        //         var params2 = [Number(post.rows[0].subforum_id)];

        //         sql3 = "SELECT category_name FROM category ";
        //         sql3 += "WHERE post_id = $1;";
        //         params3 = [Number(post.rows[0].post_id)];

        //         var sql4 = "SELECT file_name FROM post_file ";
        //         sql4 += "WHERE post_id = $1;";
        //         var params4 = [Number(post_temp.rows[0].post_id)];

        //         var author_post_temp = await client.query(sql1, params1);
        //         author_post.push(author_post_temp.rows[0]);

        //         var subforum_name_post_temp = await client.query(sql2, params2);
        //         subforum_name_post.push(subforum_name_post_temp.rows[0]);

        //         var category_post_temp = await client.query(sql3, params3); //multiple categories
        //         category_post.push(category_post_temp.rows);

        //         var file_temp = await client.query(sql5, params5);
        //         for (var i = 0; i < file_temp.rows.length; i++) {
        //             file_temp.rows[i].file_name = process.cwd() + "/public/uploads/postFiles/" + file_temp.rows[i].file_name;
        //         }
        //         file.push(file_temp.rows);
        //     }

        //     //subforum
        //     sql = "SELECT COUNT(*) FROM subforum ";
        //     sql += "WHERE subforum_id >= $1;";
        //     var params = [
        //         req.query.subforum_id
        //     ];
        //     var count_subforum = await client.query(sql, params);
        //     console.log(count_subforum.rows);

        //     sql = "SELECT * FROM subforum ";
        //     sql += "ORDER BY subforum_id DESC ";
        //     sql += "LIMIT 6 OFFSET $1;";
        //     params = [
        //         Number(count_subforum.rows[0].count)
        //     ];
        //     var subforum = await client.query(sql, params);
        //     var creator_subforum = [];
        //     var category_subforum = [];

        //     for (var i = 0; i < subforum.rows.length; i++) {
        //         sql1 = "SELECT username FROM users ";
        //         sql1 += "WHERE user_id = $1 ";
        //         var params1 = [Number(subforum.rows[0].creator_id)];

        //         sql3 = "SELECT category_name FROM category ";
        //         sql3 += "WHERE subforum_id = $1;";
        //         params3 = [Number(subforum.rows[0].subforum_id)];

        //         var creator_subforum_temp = await client.query(sql1, params1);
        //         creator_subforum.push(creator_subforum_temp.rows[0]);

        //         var category_subforum_temp = await client.query(sql3, params3); //multiple categories
        //         category_subforum.push(category_subforum_temp.rows);
        //     }
        // } else {
        //     var sql = "SELECT * FROM post ";
        //     sql += "WHERE community_id IS NULL ";
        //     sql += "ORDER BY post_id DESC ";
        //     sql += "LIMIT 6;";

        //     var post = await client.query(sql);

        //     var author_post = [];
        //     var subforum_name_post = [];
        //     var category_post = [];

        //     for (var i = 0; i < post.rows.length; i++) {
        //         sql1 = "SELECT username FROM users ";
        //         sql1 += "WHERE user_id = $1 ";
        //         var params1 = [Number(post.rows[0].author_id)];

        //         sql2 = "SELECT name FROM subforum ";
        //         sql2 += "WHERE subforum_id = $1 ";
        //         var params2 = [Number(post.rows[0].subforum_id)];

        //         sql3 = "SELECT category_name FROM category ";
        //         sql3 += "WHERE post_id = $1;";
        //         params3 = [Number(post.rows[0].post_id)];

        //         var sql4 = "SELECT file_name FROM post_file ";
        //         sql4 += "WHERE post_id = $1;";
        //         var params4 = [Number(post_temp.rows[0].post_id)];


        //         var author_post_temp = await client.query(sql1, params1);
        //         author_post.push(author_post_temp.rows[0]);

        //         var subforum_name_post_temp = await client.query(sql2, params2);
        //         subforum_name_post.push(subforum_name_post_temp.rows[0]);

        //         var category_post_temp = await client.query(sql3, params3); //multiple categories
        //         category_post.push(category_post_temp.rows);

        //         var file_temp = await client.query(sql5, params5);
        //         for (var i = 0; i < file_temp.rows.length; i++) {
        //             file_temp.rows[i].file_name = process.cwd() + "/public/uploads/postFiles/" + file_temp.rows[i].file_name;
        //         }
        //         file.push(file_temp.rows);
        //     }
        //     sql = "SELECT * FROM subforum ";
        //     sql += "ORDER BY subforum_id DESC ";
        //     sql += "LIMIT 6;";
        //     var subforum = await client.query(sql);
        //     var creator_subforum = [];
        //     var category_subforum = [];

        //     for (var i = 0; i < subforum.rows.length; i++) {
        //         sql1 = "SELECT username FROM users ";
        //         sql1 += "WHERE user_id = $1 ";
        //         var params1 = [Number(subforum.rows[0].creator_id)];

        //         sql3 = "SELECT category_name FROM category ";
        //         sql3 += "WHERE subforum_id = $1;";
        //         params3 = [Number(subforum.rows[0].subforum_id)];

        //         var creator_subforum_temp = await client.query(sql1, params1);
        //         creator_subforum.push(creator_subforum_temp.rows[0]);

        //         var category_subforum_temp = await client.query(sql3, params3); //multiple categories
        //         category_subforum.push(category_subforum_temp.rows);
        //     }
        // }

        //logged in user

        var sql1 = "SELECT interests FROM interests ";
        sql1 += "WHERE user_id = $1;";

        var sql2 = "SELECT qualifications FROM qualifications ";
        sql2 += "WHERE user_id = $1;";

        var sql3 = "SELECT about FROM about ";
        sql3 += "WHERE user_id = $1;";

        var params = [
            1, //user_id
        ];

        var interests = await client.query(sql1, params); //list of interests
        var qualifications = await client.query(sql2, params); //list of qualifications
        var about = await client.query(sql3, params);

        var post_id = [];
        var subforum_id = [];

        //interests
        for (var i = 0; i < interests.rows.length; i++) {
            var sql1 = "SELECT post_id FROM category ";
            sql1 += "WHERE to_tsvector(category_name) @@ to_tsquery($1) ";
            sql1 += "AND post_id IS NOT NULL;";

            var sql2 = "SELECT post_id FROM post ";
            sql2 += "WHERE to_tsvector(title) @@ to_tsquery($1) OR ";
            sql2 += "to_tsvector(content) @@ to_tsquery($1);";

            var sql3 = "SELECT subforum_id FROM category ";
            sql3 += "WHERE to_tsvector(category_name) @@ to_tsquery($1) ";
            sql3 += "AND subforum_id IS NOT NULL;";

            var sql4 = "SELECT subforum_id FROM subforum ";
            sql4 += "WHERE to_tsvector(name) @@ to_tsquery($1) OR ";
            sql4 += "to_tsvector(description) @@ to_tsquery($1)";

            params = [interests.rows[i].interests.replace(/ /g, " | ")];

            var temp1 = await client.query(sql1, params);
            var temp2 = await client.query(sql2, params);
            var temp3 = await client.query(sql3, params);
            var temp4 = await client.query(sql4, params);

            post_id = post_id.concat(temp1.rows, temp2.rows);
            subforum_id = subforum_id.concat(temp3.rows, temp4.rows);
        }

        //qualifications
        for (var i = 0; i < qualifications.rows.length; i++) {
            var sql1 = "SELECT post_id FROM category ";
            sql1 += "WHERE to_tsvector(category_name) @@ to_tsquery($1) ";
            sql1 += "AND post_id IS NOT NULL;";

            var sql2 = "SELECT post_id FROM post ";
            sql2 += "WHERE to_tsvector(title) @@ to_tsquery($1) OR ";
            sql2 += "to_tsvector(content) @@ to_tsquery($1);";

            var sql3 = "SELECT subforum_id FROM category ";
            sql3 += "WHERE to_tsvector(category_name) @@ to_tsquery($1) ";
            sql3 += "AND subforum_id IS NOT NULL;";

            var sql4 = "SELECT subforum_id FROM subforum ";
            sql4 += "WHERE to_tsvector(name) @@ to_tsquery($1) OR ";
            sql4 += "to_tsvector(description) @@ to_tsquery($1)";

            params = [
                qualifications.rows[i].qualifications.replace(/ /g, " | "),
            ];

            var temp1 = await client.query(sql1, params);
            var temp2 = await client.query(sql2, params);
            var temp3 = await client.query(sql3, params);
            var temp4 = await client.query(sql4, params);

            post_id = post_id.concat(temp1.rows, temp2.rows);
            subforum_id = subforum_id.concat(temp3.rows, temp4.rows);
        }

        //about
        var sql1 = "SELECT post_id FROM category ";
        sql1 += "WHERE to_tsvector(category_name) @@ to_tsquery($1) ";
        sql1 += "AND post_id IS NOT NULL;";

        var sql2 = "SELECT post_id FROM post ";
        sql2 += "WHERE to_tsvector(title) @@ to_tsquery($1) OR ";
        sql2 += "to_tsvector(content) @@ to_tsquery($1);";

        var sql3 = "SELECT subforum_id FROM category ";
        sql3 += "WHERE to_tsvector(category_name) @@ to_tsquery($1) ";
        sql3 += "AND subforum_id IS NOT NULL;";

        var sql4 = "SELECT subforum_id FROM subforum ";
        sql4 += "WHERE to_tsvector(name) @@ to_tsquery($1) OR ";
        sql4 += "to_tsvector(description) @@ to_tsquery($1)";

        params = [about.rows[0].about.replace(/ /g, " | ")];

        var temp1 = await client.query(sql1, params);
        var temp2 = await client.query(sql2, params);
        var temp3 = await client.query(sql3, params);
        var temp4 = await client.query(sql4, params);

        post_id = post_id.concat(temp1.rows, temp2.rows);
        subforum_id = subforum_id.concat(temp3.rows, temp4.rows);

        post_id = lodash.uniqBy(post_id, "post_id");
        subforum_id = lodash.uniqBy(subforum_id, "subforum_id"); //removing duplicates

        //sort on the basis of post_id/subforum_id in desc order(to get latest content on top)
        post_id.sort((a, b) => {
            Number(b.post_id) - Number(a.post_id);
        });
        subforum_id.sort((a, b) => {
            Number(b.subforum_id) - Number(a.subforum_id);
        });
        if (req.query) {
            //posts
            last_post = post_id.findIndex((item) => {
                return Number(item.post_id) === req.query.post_id;
            });

            var post = [];
            var author_post = [];
            var subforum_name_post = [];
            var category_post = [];
            var file = [];

            for (var i = last_post + 1; i < post_id.length && i < last_post + 6; i++) { //6 -- no. posts on one lazy load
                var sql = "SELECT * FROM post ";
                sql += "WHERE post_id = $1 AND community_id IS NULL;";
                params = [post_id[i].post_id];
                var post_temp = await client.query(sql, params);
                post.push(post_temp.rows[0]);

                sql1 = "SELECT username FROM users ";
                sql1 += "WHERE user_id = $1 ";
                var params1 = [Number(post_temp.rows[0].author_id)];

                sql2 = "SELECT name FROM subforum ";
                sql2 += "WHERE subforum_id = $1 ";
                var params2 = [Number(post_temp.rows[0].subforum_id)];

                sql3 = "SELECT category_name FROM category ";
                sql3 += "WHERE post_id = $1;";
                params3 = [Number(post_temp.rows[0].post_id)];

                var sql4 = "SELECT file_name FROM post_file ";
                sql4 += "WHERE post_id = $1;";
                var params4 = [Number(post_temp.rows[0].post_id)];

                var author_post_temp = await client.query(sql1, params1);
                author_post.push(author_post_temp.rows[0]);

                var subforum_name_post_temp = await client.query(sql2, params2);
                subforum_name_post.push(subforum_name_post_temp.rows[0]);

                var category_post_temp = await client.query(sql3, params3); //multiple categories
                category_post.push(category_post_temp.rows);

                var file_temp = await client.query(sql4, params4);
                for (var i = 0; i < file_temp.rows.length; i++) {
                    file_temp.rows[i].file_name = process.cwd() + "/public/uploads/postFiles/" + file_temp.rows[i].file_name;
                }
                file.push(file_temp.rows);

            } //end posts

            //subforums
            last_subforum = subforum_id.findIndex((item) => {
                return Number(item.subforum_id) === req.query.subforum_id;
            });

            var subforum = [];
            var creator_subforum = [];
            var category_subforum = [];

            for (var i = last_subforum + 1; i < subforum_id.length && i < last_subforum + 6; i++) {
                var sql = "SELECT * FROM subforum ";
                sql += "WHERE subforum_id = $1;";
                params = [subforum_id[i].subforum_id];
                var subforum_temp = await client.query(sql, params);
                subforum.push(subforum_temp.rows[0]);

                var sql1 = "SELECT username FROM users ";
                sql1 += "WHERE user_id = $1 ";
                var params1 = [Number(subforum_temp.rows[0].creator_id)];

                var sql2 = "SELECT category_name FROM category ";
                sql2 += "WHERE subforum_id = $1;";
                params2 = [Number(subforum_temp.rows[0].subforum_id)];

                var creator_subforum_temp = await client.query(sql1, params1);
                creator_subforum.push(creator_subforum_temp.rows[0]);

                var category_subforum_temp = await client.query(sql2, params2); //multiple categories
                category_subforum.push(category_subforum_temp.rows);
            } //end subforum
        } else {
            //posts
            var post = [];
            var author_post = [];
            var subforum_name_post = [];
            var category_post = [];
            var file = [];

            for (var i = 0; i < post_id.length && i < 6; i++) { //6 -- no. posts on one lazy load
                var sql = "SELECT * FROM post ";
                sql += "WHERE post_id = $1 AND community_id IS NULL;";
                params = [post_id[i].post_id];
                var post_temp = await client.query(sql, params);
                post.push(post_temp.rows[0]);

                sql1 = "SELECT username FROM users ";
                sql1 += "WHERE user_id = $1 ";
                var params1 = [Number(post_temp.rows[0].author_id)];

                sql2 = "SELECT name FROM subforum ";
                sql2 += "WHERE subforum_id = $1 ";
                var params2 = [Number(post_temp.rows[0].subforum_id)];

                sql3 = "SELECT category_name FROM category ";
                sql3 += "WHERE post_id = $1;";
                params3 = [Number(post_temp.rows[0].post_id)];

                var sql4 = "SELECT file_name FROM post_file ";
                sql4 += "WHERE post_id = $1;";
                var params4 = [Number(post_temp.rows[0].post_id)];

                var author_post_temp = await client.query(sql1, params1);
                author_post.push(author_post_temp.rows[0]);

                var subforum_name_post_temp = await client.query(sql2, params2);
                subforum_name_post.push(subforum_name_post_temp.rows[0]);

                var category_post_temp = await client.query(sql3, params3); //multiple categories
                category_post.push(category_post_temp.rows);

                var file_temp = await client.query(sql4, params4);
                for (var i = 0; i < file_temp.rows.length; i++) {
                    file_temp.rows[i].file_name = process.cwd() + "/public/uploads/postFiles/" + file_temp.rows[i].file_name;
                }
                file.push(file_temp.rows);

            } //end posts

            //subforums
            var subforum = [];
            var creator_subforum = [];
            var category_subforum = [];

            for (var i = 0; i < subforum_id.length && i < 6; i++) {
                var sql = "SELECT * FROM subforum ";
                sql += "WHERE subforum_id = $1;";
                params = [subforum_id[i].subforum_id];
                var subforum_temp = await client.query(sql, params);
                subforum.push(subforum_temp.rows[0]);

                var sql1 = "SELECT username FROM users ";
                sql1 += "WHERE user_id = $1 ";
                var params1 = [Number(subforum_temp.rows[0].creator_id)];

                var sql2 = "SELECT category_name FROM category ";
                sql2 += "WHERE subforum_id = $1;";
                params2 = [Number(subforum_temp.rows[0].subforum_id)];

                var creator_subforum_temp = await client.query(sql1, params1);
                creator_subforum.push(creator_subforum_temp.rows[0]);

                var category_subforum_temp = await client.query(sql2, params2); //multiple categories
                category_subforum.push(category_subforum_temp.rows);
            } //end subforum
            console.log(post);
        }
        var data = {
            post: post, //array of posts --all column names
            author: author_post, //array of authors --username
            subforum_post: subforum_name_post, //array of subforum names for each post -- name
            category_post: category_post, //2D array of categories(MULTIPLE categories per post) --category_name
            file: file, //2D array of files(MULTIPLE files per post(absolute file path)) --file_name
            subforum: subforum, //array of subforum --all column names
            creator_subforum: creator_subforum, //array of creators of subforums --username
            category_subforum: category_subforum //2D array of categories(MULTIPLE categories per subforum) --category_name
        };
    } catch (err) {
        console.log("ERROR IS : ", err);
    }
});

module.exports = router;