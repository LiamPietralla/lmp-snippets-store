# Waiting for Servers to be Provisioned and Ready

## Overview

Often when working with automated deployments you will want to wait for your servers to be provisioned and ready before running your Ansible playbook. This is a simple bash script you can run before your Ansible playbook to wait for your servers to be ready.

## The Script

The script below assumes a few things, namely:
* You have a private key file called `private.key` in the root directory of your project
* You have a terraform directory in the root of your project
* You have two IP address outputs in your terraform called `server-1-ip-address` and `server-2-ip-address`

```bash [wait-for-servers.sh]
# Simple script to wait till all the servers are up and running (e.g. not setting up)
echo 'Trying SSH to new instances, checking cloud-init status... (It will say "Connection refused" until it is ready.)'

# 6 retries x 5 seconds each = maximum approx 30 seconds to wait for SSH, then bail.
check_instances() {
    echo now checking...
    ssh root@"$server_1_ip" -o StrictHostKeyChecking=no -i private.key cloud-init status -w 
    ssh root@"$server_2_ip" -o StrictHostKeyChecking=no -i private.key cloud-init status -w
}

echo getting hostnames...

# Navigate to terraform directory 
cd terraform
server_1_ip="$(terraform output -raw server-1-ip-address)"
server_2_ip="$(terraform output -raw server-2-ip-address)"

# Navigate back to root directory
cd ..

timeout=6
stopwatch=0
until check_instances; do
  stopwatch=$((stopwatch+1))
  if [[ $stopwatch -ge $timeout ]]; then echo Error: Timed out waiting for instance; exit -1; fi
  sleep 5
done
```