Vagrant configuration for ReDBox development environment using VirtualBox
====================

Mac OS Installation instructions
## 1. [Install Homebrew](http://brew.sh/)
`/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"`

## 2. Install Vagrant
`brew install vagrant`
or
`brew cask install vagrant`

## 3. Bring box up
`vagrant up`

Your box should initialise and install all the required development tools

## 4. SSH onto box
`vagrant ssh`

---
### Sync Issues

If you get Vagrant errors when mounting synced folder. Installing the VirtualBox Guest Additions can help

`vagrant plugin install vagrant-vbguest`

## 7. Start unison file synching
`vagrant unison-sync-polling`

This will start polling every second your local machine share directory and the directory on the virtual machine and keep them in sync as files change. You may want to do this in another console window as this will stay running until you hit Ctrl+C

- If there is an error mentioning inconsistent state, try deleting the archives:
    On Mac OS X, the local files are stored in ~/Library/Application\ Support/Unison you can also create a ~/.unison folder (if it is not already created) so that Unison stores the archives in that location

### Sync Issues

- Run `vagrant unison-cleanup` this will delete the files in the guest machine
- Delete `~/.unison/` key files on host machine

### Sync Issues

- Run `vagrant unison-cleanup` this will delete the files in the guest machine
- Delete `~/.unison/` key files on host machine

## 8. SSH onto box
`vagrant ssh`

## 9. Using synced_folder

We can add additional synced_folder's

```
# Running synced_folder on a hook
config.vm.synced_folder "/Users/moises/source/code.research/sails-hook-redbox-omero", "/opt/hooks/sails-hook-redbox-omero", id: "omero"
# Running synced_folder on redbox-portal
config.vm.synced_folder "/Users/moises/source/github/redbox-portal", "/opt/redbox-portal", id: "redbox-portal", type: "rsync", rsync__auto: true, rsync__exclude: ['lodash-lib','node_modules','.git']
```


To make this work

```
vagrant plugin install vagrant-vbguest
```


### If you cannot run vagrant-vbguest; this might help: Example fixing vboxfs

*VirtualBox: mount.vboxsf: mounting failed with the error: No such device*

from: https://stackoverflow.com/questions/28328775/virtualbox-mount-vboxsf-mounting-failed-with-the-error-no-such-device

```
sudo yum update
sudo yum install kernel-$(uname -r) kernel-devel kernel-headers # or: reinstall
rpm -qf /lib/modules/$(uname -r)/build
ls -la /lib/modules/$(uname -r)/build
```
Then:
```
#sudo reboot # and re-login
```
then Run:
```
vagrant --provision
vagrant plugin install vagrant-vbguest
```
You can manually run vboxxadd:
```
sudo ln -sv /usr/src/kernels/$(uname -r) /lib/modules/$(uname -r)/build
sudo /opt/VBoxGuestAdditions-*/init/vboxadd setup
```
