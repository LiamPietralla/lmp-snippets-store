# Generating a Ansible Inventory File from Terraform

## Overview

Often when working with automated deployments you will want to generate a dynamic inventory file for Ansible (usually after your infrastructure has been provisioned). This is a simple snippet to generate an inventory file from Terraform.

## Terraform Snippet

First we need to create an ouput variable to hold the inventory file.

::: code-group

```hcl [ouputs.tf]
output "ansible_inventory_yml" {
  description = "An Ansible inventory (in YAML format) containing IP addresses as required by the Ansible playbook to configure the servers."
  value = local.ansible_inventory_yml
}
```

:::

Next we will create the local variable that will hold the inventory file.

::: info

In this example we are using a DigitalOcean droplet, but you can use any Terraform resource that has an IP address.

:::

::: code-group

```hcl [locals.tf]
locals {
  ansible_inventory_yml = <<-EOF
    all:
      hosts:
        app:
          ansible_host: ${digitalocean_droplet.server.ipv4_address}
  EOF
}
```

:::

::: tip

It's better to use a local and output variable rather then a local_file as this avoids spurious plan noise when running on CI runners.

:::

Once all configured you can run `terraform apply` and the inventory file will be ouput to the console. To create the file you can pipe the output to a file (either in the console or in your CI pipeline).

```bash
terraform output -raw ansible_inventory_yml > ansible-inventory.yml
```