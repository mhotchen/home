# Overview

This is a self booting project to create the parts of infrastructure that shouldn't be managed directly by services.

What I mean by self booting is that this project also ensures that its own repository is configured which on top of
the early users is one of the first things I did.

# How to use this repo

First install the [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/installing.html) then run `aws configure`
to enter your credentials/default region (currently it's eu-west-2 aka London).

Next install the [Terraform](https://www.terraform.io/downloads.html) CLI client.

Finally execute the following commands:

```bash
# Uses your AWS access token to check for repository permissions.
git config --global credential.helper '!aws codecommit credential-helper $@'
git config --global credential.UseHttpPath true
git clone https://git-codecommit.eu-west-2.amazonaws.com/v1/repos/Infrastructure

# Initialize terraform
cd Infrastructure
terraform init
```

Now *read the terraform documentation to learn how to declare new infrastructure and learn how it manages state*.

# Users

I've decided each developer should have two distinct accounts: one of the AWS console and one for the CLI. This allows
eg. the AWS console to be locked to read-only to prevent the temptation of making changes directly in the UI.

Here are the proposed early permission groups:

1. Admin console: can login in to the AWS console and make changes through the UI, including to users/groups
2. Admin CLI: same permissions as for the console except on the CLI
3. Devops console: can only read from the AWS console
4. Devops CLI: can make changes via the AWS CLI/Terraform but can't log in to the UI. Also no permissions to make
   changes to user accounts.

Repository permissions are attached to the CLI user allowing the use of the AWS credentials helper CLI. This means
there's no need for SSH keys to check out code from version control simplifying onboarding a little bit.

## Adding a new user

Check out the `users-and-groups.tf` file for the users and groups that are declared. Each user is just a few variables
and you can very easily create a new standard user or group by copying an existing user's config and updating the
values. Because of the way terraform manages state, removing a user from the terraform file and running `terraform
apply` will actually delete the user and associated policies from AWS. Neat!

For GPG keys you can either embed the public key as a base64 encoded string or have the user upload it to keybase.

The GPG key is used to encrypt the user's password and access keys ensuring even the admin creating this user can't see
them.
