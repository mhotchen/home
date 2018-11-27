# Overview

This is a self booting project to create the services that make up my personal internet presence.

What I mean by self booting is that this project also ensures that its own repository is configured which on top of
the early users is one of the first things I did.

# Before making changes

Before making any changes to this repo make sure you have completed the following steps.

First install the [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/installing.html) then run `aws configure`
to enter your credentials/default region (currently it's eu-west-2 aka London). Store these under a profile called
'personal'.

Next execute the following commands:

```bash
# Uses your AWS access token to check for repository permissions.
git config --global credential.UseHttpPath true
git config --global credential.helper '!aws codecommit credential-helper --profile personal $@'
git clone https://git-codecommit.eu-west-2.amazonaws.com/v1/repos/Repo personal
```
