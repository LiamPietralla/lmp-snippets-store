# Installing Docker on Servers With Ansible

## Overview

This is a simple playbook to install Docker on a server. This is really useful for getting docker installed on servers before running a dockerised workload.

## Pre-requisites

You will need ansible already installed on your machine and a ansible inventory file, check out the sample below: 

```yml
playbook-hosts:
  hosts:
    host1:
      ansible_host: <ip-address>
```

This playbook also assumes that you have a user with sudo privileges on the remote machine, and you can use ssh keys to authenticate.

## The playbook

The playbook to install docker is below:

```yml
---
- name: Install Docker
  hosts: playbook-hosts
  remote_user: root # or whatever user you have
  become: yes # sudo
  tasks:
    - name: Install aptitude
      apt:
        name: aptitude
        state: latest
        update_cache: true

    - name: Install required system packages
      apt:
        pkg:
          - apt-transport-https
          - ca-certificates
          - curl
          - software-properties-common
          - python3-pip
          - virtualenv
          - python3-setuptools
        state: latest
        update_cache: true

    - name: Add Docker GPG apt Key
      apt_key:
        url: https://download.docker.com/linux/ubuntu/gpg
        state: present

    - name: Add Docker Repository
      apt_repository:
        repo: deb https://download.docker.com/linux/ubuntu jammy stable
        state: present

    - name: Update apt and install docker-ce
      apt:
        name: docker-ce
        state: latest
        update_cache: true

    - name: Install Docker Module for Python
      pip:
        name: docker
```

::: tip 

Apitude is used to install the packages as it is more reliable than apt-get, and also preferred by Ansible.

:::

## Running the playbook 

To run the playbook, you can use the following command:

```bash
ansible-playbook -i <inventory-file> <playbook-name> --private-key <ssh-key>
```