const axios = require('axios');
const moment = require("moment-timezone");
const { zokou } = require(__dirname + "/../framework/zokou");

// Function to format large numbers with commas
const formatNumber = (num) => num.toLocaleString();

// Function to fetch detailed GitHub repository information
const fetchGitHubRepoDetails = async () => {
    try {
        const repo = 'bwbxmd/B.M.B-TECH'; // Updated repo
        const response = await axios.get(`https://api.github.com/repos/${repo}`);
        const {
            name, description, forks_count, stargazers_count,
            watchers_count, open_issues_count, owner, license
        } = response.data;

        return {
            name,
            description: description || "No description provided",
            forks: forks_count,
            stars: stargazers_count,
            watchers: watchers_count,
            issues: open_issues_count,
            owner: owner.login,
            license: license ? license.name : "No license",
            url: response.data.html_url,
        };
    } catch (error) {
        console.error("Error fetching GitHub repository details:", error);
        return null;
    }
};

// Define the commands that can trigger this functionality
const commands = ["repoo", "repo", "script", "sc"];

commands.forEach((command) => {
    zokou({ nomCom: command, categorie: "GitHub" }, async (dest, zk, commandeOptions) => {
        let { repondre } = commandeOptions;

        const repoDetails = await fetchGitHubRepoDetails();

        if (!repoDetails) {
            repondre("❌ Failed to fetch GitHub repository information.");
            return;
        }

        const {
            name, description, forks, stars, watchers,
            issues, owner, license, url
        } = repoDetails;

        const currentTime = moment().format('DD/MM/YYYY HH:mm:ss');
        const infoMessage = `
🌐 *GitHub Repository Info* 🌐

💻 *Name:* ${name}
📜 *Description:* ${description}
⭐ *Stars:* ${formatNumber(stars)}
🍴 *Forks:* ${formatNumber(forks)}
👀 *Watchers:* ${formatNumber(watchers)}
❗ *Open Issues:* ${formatNumber(issues)}
👤 *Owner:* ${owner}
📄 *License:* ${license}

📅 *Fetched on:* ${currentTime}
`;

        try {
            // Send the follow-up image first with a caption
            await zk.sendMessage(dest, {
                image: { url: "https://files.catbox.moe/qzm0pl.jpg" }, // Updated image
                caption: `✨ Repository Highlights ✨\n\n🛠️ Developed by *B.M.B-TECG*\n\nRepo URL:\nhttps://github.com/bwbxmd/B.M.B-TECH/fork`,
            });

            // Follow up with the GitHub repository details
            await zk.sendMessage(dest, {
                text: infoMessage,
            });

        } catch (e) {
            console.log("❌ Error sending GitHub info:", e);
            repondre("❌ Error sending GitHub info: " + e.message);
        }
    });
});
              
