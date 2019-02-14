using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace ReactiveImageRating.Controllers
{
    /// <summary>
    /// RactiveImageController contains all functions needed for this project to function.
    /// Just a couple of notes: that i would of split this function into two, that corrispond to the two database tables that this function accesses.
    /// Also I rather work with a live database. Although its a phpmyadmin. The connection strings are soo simular that im able to produce a sample string
    /// (That last nope wasn't meant to sound more sincere rather than pretentious)
    /// Note I would also not include irrelevant comments.
    ///
    /// Ref's used: MySql.Data.dll
    /// 
    /// </summary>
    [Route("api/[controller]")]
    public class ImageController
    {


        /// <summary>
        /// Grabs all the image data from the database.
        /// </summary>
        /// <param name="_vote">A vessal for the users session variable being posted</param>
        /// <returns>IEnumerable filled with image classes that contains all variables needed</returns>
        [HttpPost("[action]")]
        public IEnumerable<Image> GenerateImages([FromBody] Vote _vote)
        {
            // Generate query and execute it
            string queryString = "" +
                "SELECT `images`.`url`, `images`.`name`, `images`.`author` " +
                "FROM `images` LEFT JOIN (" +
                    "SELECT * " +
                    "FROM `votes` " +
                    "WHERE `session` = " + '"' + _vote.session + '"' +
                ") AS `user_session` " +
                "ON `images`.`url` = `user_session`.`url` " +
                "WHERE `user_session`.`session` IS NULL";
            List<string[]> query = executeSQL(new StringBuilder(queryString));

            // Shuffle the images around, to make it seem like their randomly generated
            Random rnd = new Random();
            query = query.OrderBy(i => rnd.Next()).ToList();

            // Return the enumerable image values
            return Enumerable.Range(1, query.Count).Select(index => new Image
            {
                url = query[index - 1][0],
                name = query[index - 1][1],
                author = query[index - 1][2]
            });
        }


        /// <summary>
        /// Cast the users vote and inserts it into the database
        /// </summary>
        /// <param name="_vote">The vote object</param>
        /// <returns>Always true when executed without fault.</returns>
        [HttpPost("[action]")]
        public bool castVote([FromBody] Vote _vote)
        {
            // Generate query and executes it
            string queryString = "INSERT INTO `votes` (`session`, `url`, `vote`, `time`) " +
                "VALUES ('" + _vote.session + "', '" + _vote.url + "', '" + _vote.result + "', CURRENT_TIMESTAMP)";
            List<string[]> query = executeSQL(new StringBuilder(queryString));

            // Always return ture
            return true;
        }


        /// <summary>
        /// Returns an interesting statistic for every vote the user has made.
        /// </summary>
        /// <param name="_vote">A vessal for the users session variable being posted</param>
        /// <returns></returns>
        [HttpPost("[action]")]
        public IEnumerable<Statistic> GetImageHistory([FromBody] Vote _vote)
        {
            // First obtain all the users votes
            string userVoteQueryString = "" +
                "SELECT * " +
                    "FROM `votes` " +
                    "WHERE `session` = " + '"' + _vote.session + '"';
            List<string[]> userVoteQuery = executeSQL(new StringBuilder(userVoteQueryString));

            // Then obtain the number of votes on every image
            string imageStatQueryString = "" + 
                "SELECT `images`.`url`, `images`.`name`, `images`.`author`, `votes`.`vote`, COUNT(*) AS `result` " +
                "FROM `images` " +
                "LEFT JOIN `votes` " +
                "ON `images`.`url` = `votes`.`url` " +
                "GROUP BY `votes`.`vote`, `votes`.`url` " +
                "ORDER BY `images`.`url` DESC";
            List<string[]> imageStatQuery = executeSQL(new StringBuilder(imageStatQueryString));

            // Shuffle the image stats, for random statements. This will be explored more further on.
            Random rnd = new Random();
            imageStatQuery = imageStatQuery.OrderBy(i => rnd.Next()).ToList();

            // Create an IEnumberable votes variable for easier manipulation. 
            // Even though this doesnt hold up later down the track.
            IEnumerable<Vote> userVotes = Enumerable.Range(0, userVoteQuery.Count).Select(index => new Vote
            {
                session = userVoteQuery[index][0],
                url = userVoteQuery[index][1],
                result = userVoteQuery[index][2],
                time = userVoteQuery[index][3]
            });

            // Create the two list of strings that contain the users and overall statistic statements.
            // These two statistics will be used to show what the user voted on, compared to all previous users.
            List<string> userStatList = new List<string>();
            List<string> imgStatList = new List<string>();

            // Lets create those statements for each of the users votes
            // Note that both the user and overall stats will be split
            foreach (Vote vote in userVotes)
            {
                //// User Statistic ////
                // Simply just state if the user liked or disliked the image
                string userStatString = "";
                if (vote.result == "False")
                {
                    userStatString += "You disliked this image.";
                } else
                {
                    userStatString += "You Liked this image.";
                }


                //// Overall Statistic ////
                // Instatiate the image string
                string imgStatString = "";

                // Count the total amount of votes for precentage statistics
                int total = 0;
                foreach (string[] stat in imageStatQuery)
                {
                    if (stat[0] == vote.url)
                    {
                        total += int.Parse(stat[4]);
                    }
                }

                // Find which image this vote corrisponds to.
                foreach (string[] stat in imageStatQuery)
                {
                    if (stat[0] == vote.url)
                    {
                        // Randomly either say how many precent of users of users liked/disliked the image
                        // Or how many users had the same choice as the users choice. 
                        // Although this is technically a 75/25 chance.
                        if (rnd.Next(0, 2) == 0)
                        {
                            double d = Math.Round((double)((double.Parse(stat[4]) / total) * 100), 2);
                            imgStatString += d + "% of users ";
                        }
                        else
                        {
                            if (bool.Parse(stat[3]) == bool.Parse(vote.result))
                            {
                                imgStatString += stat[4] + " users";
                            } else
                            {
                                double d = Math.Round((double)((double.Parse(stat[4]) / total) * 100), 2);
                                imgStatString += "%" + d + " of users ";
                            }
                        }
                        
                        // Finish off the string that shows if the statistic is a dislike or like statistic
                        if (stat[3] == "False")
                        {
                            imgStatString += " disliked this image.";
                        }
                        else
                        {
                            imgStatString += " liked this image.";
                        }
                        // We found the image, Leave the loop
                        break;
                    }
                }

                // Append the statistic to their respective list
                userStatList.Add(userStatString);
                imgStatList.Add(imgStatString);
            }

            // Populate the statistic statements in an ienumerable variable and return it
            IEnumerable<Statistic> ret = Enumerable.Range(0, userStatList.Count).Select(index => new Statistic
            {
                url = userVotes.ElementAt(index).url,
                userStat = userStatList[index],
                imgStat = imgStatList[index]
            });
            return ret;
        }

        /// <summary>
        /// Executes a query to the Database
        /// </summary>
        /// <param name="_query">The query being executed</param>
        /// <returns>The results of the query.</returns>
        public static List<string[]> executeSQL(StringBuilder _query)
        {
            // Set the connection variable and the connection string
            SqlConnection conn = new SqlConnection();
            string server = "sg2plcpnl0239.prod.sin2.secureserver.net";
            string database = "ReactiveImageDatabase";
            string uid = "test"; // Note that the user id and password would be more secure
            string password = "testing";
            string connectionString;

            List<string[]> ret = new List<string[]>();

            connectionString = "Server = " + server + ";" + " Database = " +
            database + ";" + " Uid = " + uid + ";" + " Pwd = " + password + ";";

            // Set the connection string
            conn.ConnectionString = connectionString;

            // Initiate and connect the MySql c# extension
            MySql.Data.MySqlClient.MySqlConnection connection;
            connection = new MySql.Data.MySqlClient.MySqlConnection(connectionString);
            connection.Open();

            // If the connection is open, send the query off to be processed, and don't worry if it takes too long
            if (connection.State == ConnectionState.Open)
            {
                MySql.Data.MySqlClient.MySqlCommand cmd = new MySql.Data.MySqlClient.MySqlCommand(_query.ToString(), connection);
                cmd.CommandTimeout = 0;

                // Create a query reader
                var reader = cmd.ExecuteReader();

                // Read until there are no rows to read.
                while (reader.Read())
                {

                    // Put all fields found in the row into a string array
                    string[] row = new string[reader.FieldCount];
                    for (int i = 0; i < reader.FieldCount; i++)
                    {
                        if (reader.IsDBNull(i))
                        {
                            row[i] = null;
                        }
                        else
                        {
                            row[i] = reader.GetString(i);
                        }
                    }

                    // After all the strings have been inserted into the array put it into a list 
                    ret.Add(row);
                }
            }
            else
            {
                Console.WriteLine("Database connection failed.");
            }

            // At this point we have finished the query, then close the connection.
            connection.Close();
            conn.Close();

            // Then return the rows that we've generated within the query
            return ret;
        }


        /// <summary>
        /// Contains all variables needed to communicate with the images tables
        /// </summary>
        public class Image
        {
            public string url { get; set; }
            public string name { get; set; }
            public string author { get; set; }
        }


        /// <summary>
        /// Contains all variables needed to communicate with the votes tables
        /// </summary>
        public class Vote
        {
            public string session { get; set; }
            public string url { get; set; }
            public string result { get; set; }
            public string time { get; set; }
        }


        /// <summary>
        /// Vessals simple statistic strings
        /// </summary>
        public class Statistic
        {
            public string url { get; set; }
            public string userStat { get; set; }
            public string imgStat { get; set; }
        }
    }
}
