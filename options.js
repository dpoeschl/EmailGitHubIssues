function save_options() {
    var emailIssuesList = document.getElementById('emailIssuesList').checked;
    var emailIssue = document.getElementById('emailIssue').checked;
    var emailPullRequestList = document.getElementById('emailPullRequestList').checked;
    var emailPullRequest = document.getElementById('emailPullRequest').checked;

    var jenkinsOpenDetailsLinksInNewTab = document.getElementById('jenkinsOpenDetailsLinksInNewTab').checked;
    var jenkinsShowRunTime = document.getElementById('jenkinsShowRunTime').checked;
    var jenkinsShowFailureIndications = document.getElementById('jenkinsShowFailureIndications').checked;
    var jenkinsShowTestFailures = document.getElementById('jenkinsShowTestFailures').checked;
    var jenkinsShowBugFilingButton = document.getElementById('jenkinsShowBugFilingButton').checked;
    var jenkinsShowRetestButton = document.getElementById('jenkinsShowRetestButton').checked;
    var jenkinsOfferInlineFailuresOnPRList = document.getElementById('jenkinsOfferInlineFailuresOnPRList').checked;
    var showCodeReviewInfo = document.getElementById("showCodeReviewInfo").checked;
    var issueCreationRouting = document.getElementById("issueCreationRouting").value;
    var nonDefaultTestInfo = document.getElementById("nonDefaultTestInfo").value;
    var defaultIssueLabels = document.getElementById("defaultIssueLabels").value;
    var testRerunText = document.getElementById("testRerunText").value;
    var codeReviewOptions = document.getElementById("codeReviewOptions").value;

    chrome.storage.sync.set({
        emailIssuesList: emailIssuesList,
        emailIssue: emailIssue,
        emailPullRequestList: emailPullRequestList,
        emailPullRequest: emailPullRequest,
        jenkinsOpenDetailsLinksInNewTab: jenkinsOpenDetailsLinksInNewTab,
        jenkinsShowRunTime: jenkinsShowRunTime,
        jenkinsShowFailureIndications: jenkinsShowFailureIndications,
        jenkinsShowTestFailures: jenkinsShowTestFailures,
        jenkinsShowBugFilingButton: jenkinsShowBugFilingButton,
        jenkinsShowRetestButton: jenkinsShowRetestButton,
        jenkinsOfferInlineFailuresOnPRList: jenkinsOfferInlineFailuresOnPRList,
        issueCreationRouting: issueCreationRouting,
        nonDefaultTestInfo: nonDefaultTestInfo,
        defaultIssueLabels: defaultIssueLabels,
        testRerunText: testRerunText,
        showCodeReviewInfo: showCodeReviewInfo,
        codeReviewOptions: codeReviewOptions
    }, function () {
        // Update status to let user know options were saved.
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function () {
            status.textContent = '';
        }, 750);
    });
}

function restore_options() {
    chrome.storage.sync.get({
        // Provide defaults that match those in background.js
        emailIssuesList: true,
        emailIssue: true,
        emailPullRequestList: true,
        emailPullRequest: true,
        jenkinsOpenDetailsLinksInNewTab: true,
        jenkinsShowRunTime: true,
        jenkinsShowFailureIndications: true,
        jenkinsShowTestFailures: true,
        jenkinsShowBugFilingButton: true,
        jenkinsShowRetestButton: true,
        jenkinsOfferInlineFailuresOnPRList: true,
        showCodeReviewInfo: true,
        issueCreationRouting: "dotnet/roslyn-internal:dotnet/roslyn",
        nonDefaultTestInfo: "dotnet/roslyn:vsi:prtest/win/vsi/p0\ndotnet/roslyn-internal:vsi:prtest/win/vsi/p0",
        defaultIssueLabels: "dotnet:Bug\ndotnet/roslyn-internal:Contributor Pain,Area-Infrastructure",
        testRerunText: "*:retest {0} please\ndotnet:@dotnet-bot retest {0} please",
        codeReviewOptions: "*;:+1:,:thumbsup:,:shipit:,LGTM;:-1:,:thumbsdown:;Test Signoff",
    }, function (items) {
        document.getElementById('emailIssuesList').checked = items.emailIssuesList;
        document.getElementById('emailIssue').checked = items.emailIssue; // TODO: Also controls copy workitem
        document.getElementById('emailPullRequestList').checked = items.emailPullRequestList;
        document.getElementById('emailPullRequest').checked = items.emailPullRequest;
        document.getElementById('jenkinsOpenDetailsLinksInNewTab').checked = items.jenkinsOpenDetailsLinksInNewTab;
        document.getElementById('jenkinsShowRunTime').checked = items.jenkinsShowRunTime;
        document.getElementById('jenkinsShowFailureIndications').checked = items.jenkinsShowFailureIndications;
        document.getElementById('jenkinsShowTestFailures').checked = items.jenkinsShowTestFailures;
        document.getElementById('jenkinsShowBugFilingButton').checked = items.jenkinsShowBugFilingButton;
        document.getElementById('jenkinsShowRetestButton').checked = items.jenkinsShowRetestButton;
        document.getElementById('jenkinsOfferInlineFailuresOnPRList').checked = items.jenkinsOfferInlineFailuresOnPRList;
        document.getElementById('showCodeReviewInfo').checked = items.showCodeReviewInfo;
        document.getElementById('codeReviewOptions').value = items.codeReviewOptions;
        document.getElementById('issueCreationRouting').value = items.issueCreationRouting;
        document.getElementById('nonDefaultTestInfo').value = items.nonDefaultTestInfo;
        document.getElementById('defaultIssueLabels').value = items.defaultIssueLabels;
        document.getElementById('testRerunText').value = items.testRerunText;
    });
    refresh_host_permissions();
}

function refresh_host_permissions() {
    chrome.permissions.getAll(function (perms) {
        document.getElementById('existingHostPermissions').value = perms.origins.join('\n');
    });
}

function add_host_permission() {
    var hostnameInput = document.getElementById('addHostPermissionHostname');
    var error = document.getElementById('addHostPermissionError');
    error.textContent = '';

    chrome.permissions.request({
        origins: [hostnameInput.value]
    }, function (granted) {
        if (chrome.runtime.lastError) {
            error.textContent = 'Error: ' + chrome.runtime.lastError.message;
        } 
        else if (granted) {
            hostnameInput.value = '';
        } else {
            error.textContent = 'Error: Permission not granted.';
        }

        refresh_host_permissions();
    });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
document.getElementById('addHostPermission').addEventListener('click', add_host_permission);