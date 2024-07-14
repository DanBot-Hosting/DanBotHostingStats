module.exports = async (client, oldMember, newMember) => {
    // If user nickname changes
    if (oldMember.displayName != newMember.displayName) {
        let displayName = newMember.displayName.toLowerCase();

        if (displayName.match(/^[a-z0-9]/i) == null) {
            return newMember.setNickname("I love Dan <3");
        }

        if (config.BannedNames.some((r) => displayName.includes(r))) {
            newMember.setNickname("Moderated Nickname");
        }

    }
};
