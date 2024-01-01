# Configuring Certbot SSL with Ansible (and Nginx)

## Overview

This is a simple playbook to setup and configure certbot SSL certificates on a server. This is really useful for getting SSL certificates installed on servers before running a workload.

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

The playbook to install and then run certbot is below:

```yml
---
- name: Install and Run Certbot
  hosts: playbook-hosts
  remote_user: root # or whatever user you have
  become: yes # sudo
  tasks:
  vars:
    ssl_email: <email-address>
    domain_list: <domain-name> # comma separated list of domains (e.g. example.com,www.example.com)
  tasks:
    - name: Install certbot
      apt:
        pkg:
          - certbot
          - python3-certbot-nginx
        state: latest
        update_cache: true

    - name: Run certbot to get SSL certificate
      shell: certbot --nginx --non-interactive --agree-tos --email {{ ssl_email }} --domains {{ domain_list }}

    - name: Restart nginx
      service:
        name: nginx
        state: restarted
        enabled: yes
```

## Running the playbook 

To run the playbook, you can use the following command:

```bash
ansible-playbook -i <inventory-file> <playbook-name> --private-key <ssh-key>
```