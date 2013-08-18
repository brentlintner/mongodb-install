MongoDB Install
=============

A tiny NodeJS lib for installing MongoDB binaries.

This is a WIP. It works, but it is currently half-done, and (probably) workable.

Is the CLI assuming too much? Is its integrity in question?

In that case, a lot of things are overridable.

For example:

    mongodb-install --to some/place --arch x86_64 --os linux

    mongodb-install --from custom/path

    mongodb-install --from http://custom/url
