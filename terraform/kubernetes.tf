locals {
  cluster_name                      = "sudoku.org"
  master_autoscaling_group_ids      = [aws_autoscaling_group.master-eu-west-2a-masters-sudoku-com.id]
  master_security_group_ids         = [aws_security_group.masters-sudoku-com.id]
  masters_role_arn                  = aws_iam_role.masters-sudoku-com.arn
  masters_role_name                 = aws_iam_role.masters-sudoku-com.name
  node_autoscaling_group_ids        = [aws_autoscaling_group.nodes-eu-west-2a-sudoku-com.id, aws_autoscaling_group.spot-eu-west-2a-sudoku-com.id]
  node_security_group_ids           = [aws_security_group.nodes-sudoku-com.id]
  node_subnet_ids                   = [aws_subnet.eu-west-2a-sudoku-com.id]
  nodes_role_arn                    = aws_iam_role.nodes-sudoku-com.arn
  nodes_role_name                   = aws_iam_role.nodes-sudoku-com.name
  region                            = "eu-west-2"
  route_table_private-eu-west-2a_id = aws_route_table.private-eu-west-2a-sudoku-com.id
  route_table_public_id             = aws_route_table.sudoku-com.id
  subnet_eu-west-2a_id              = aws_subnet.eu-west-2a-sudoku-com.id
  subnet_utility-eu-west-2a_id      = aws_subnet.utility-eu-west-2a-sudoku-com.id
  vpc_cidr_block                    = aws_vpc.sudoku-com.cidr_block
  vpc_id                            = aws_vpc.sudoku-com.id
  vpc_ipv6_cidr_block               = aws_vpc.sudoku-com.ipv6_cidr_block
  vpc_ipv6_cidr_length              = local.vpc_ipv6_cidr_block == null ? null : tonumber(regex(".*/(\\d+)", local.vpc_ipv6_cidr_block)[0])
}

output "cluster_name" {
  value = "sudoku.org"
}

output "master_autoscaling_group_ids" {
  value = [aws_autoscaling_group.master-eu-west-2a-masters-sudoku-com.id]
}

output "master_security_group_ids" {
  value = [aws_security_group.masters-sudoku-com.id]
}

output "masters_role_arn" {
  value = aws_iam_role.masters-sudoku-com.arn
}

output "masters_role_name" {
  value = aws_iam_role.masters-sudoku-com.name
}

output "node_autoscaling_group_ids" {
  value = [aws_autoscaling_group.nodes-eu-west-2a-sudoku-com.id, aws_autoscaling_group.spot-eu-west-2a-sudoku-com.id]
}

output "node_security_group_ids" {
  value = [aws_security_group.nodes-sudoku-com.id]
}

output "node_subnet_ids" {
  value = [aws_subnet.eu-west-2a-sudoku-com.id]
}

output "nodes_role_arn" {
  value = aws_iam_role.nodes-sudoku-com.arn
}

output "nodes_role_name" {
  value = aws_iam_role.nodes-sudoku-com.name
}

output "region" {
  value = "eu-west-2"
}

output "route_table_private-eu-west-2a_id" {
  value = aws_route_table.private-eu-west-2a-sudoku-com.id
}

output "route_table_public_id" {
  value = aws_route_table.sudoku-com.id
}

output "subnet_eu-west-2a_id" {
  value = aws_subnet.eu-west-2a-sudoku-com.id
}

output "subnet_utility-eu-west-2a_id" {
  value = aws_subnet.utility-eu-west-2a-sudoku-com.id
}

output "vpc_cidr_block" {
  value = aws_vpc.sudoku-com.cidr_block
}

output "vpc_id" {
  value = aws_vpc.sudoku-com.id
}

output "vpc_ipv6_cidr_block" {
  value = aws_vpc.sudoku-com.ipv6_cidr_block
}

output "vpc_ipv6_cidr_length" {
  value = local.vpc_ipv6_cidr_block == null ? null : tonumber(regex(".*/(\\d+)", local.vpc_ipv6_cidr_block)[0])
}

provider "aws" {
  region = "eu-west-2"
}

provider "aws" {
  alias  = "files"
  region = "eu-west-2"
}

resource "aws_autoscaling_group" "master-eu-west-2a-masters-sudoku-com" {
  enabled_metrics = ["GroupDesiredCapacity", "GroupInServiceInstances", "GroupMaxSize", "GroupMinSize", "GroupPendingInstances", "GroupStandbyInstances", "GroupTerminatingInstances", "GroupTotalInstances"]
  launch_template {
    id      = aws_launch_template.master-eu-west-2a-masters-sudoku-com.id
    version = aws_launch_template.master-eu-west-2a-masters-sudoku-com.latest_version
  }
  load_balancers        = [aws_elb.api-sudoku-com.id]
  max_instance_lifetime = 0
  max_size              = 1
  metrics_granularity   = "1Minute"
  min_size              = 1
  name                  = "master-eu-west-2a.masters.sudoku.org"
  protect_from_scale_in = false
  tag {
    key                 = "KubernetesCluster"
    propagate_at_launch = true
    value               = "sudoku.org"
  }
  tag {
    key                 = "Name"
    propagate_at_launch = true
    value               = "master-eu-west-2a.masters.sudoku.org"
  }
  tag {
    key                 = "aws-node-termination-handler/managed"
    propagate_at_launch = true
    value               = ""
  }
  tag {
    key                 = "k8s.io/cluster-autoscaler/node-template/label/kops.k8s.io/instancegroup"
    propagate_at_launch = true
    value               = "master-eu-west-2a"
  }
  tag {
    key                 = "k8s.io/cluster-autoscaler/node-template/label/kops.k8s.io/kops-controller-pki"
    propagate_at_launch = true
    value               = ""
  }
  tag {
    key                 = "k8s.io/cluster-autoscaler/node-template/label/node-role.kubernetes.io/control-plane"
    propagate_at_launch = true
    value               = ""
  }
  tag {
    key                 = "k8s.io/cluster-autoscaler/node-template/label/node.kubernetes.io/exclude-from-external-load-balancers"
    propagate_at_launch = true
    value               = ""
  }
  tag {
    key                 = "k8s.io/role/control-plane"
    propagate_at_launch = true
    value               = "1"
  }
  tag {
    key                 = "k8s.io/role/master"
    propagate_at_launch = true
    value               = "1"
  }
  tag {
    key                 = "kops.k8s.io/instancegroup"
    propagate_at_launch = true
    value               = "master-eu-west-2a"
  }
  tag {
    key                 = "kubernetes.io/cluster/sudoku.org"
    propagate_at_launch = true
    value               = "owned"
  }
  vpc_zone_identifier = [aws_subnet.eu-west-2a-sudoku-com.id]
}

resource "aws_autoscaling_group" "nodes-eu-west-2a-sudoku-com" {
  enabled_metrics = ["GroupDesiredCapacity", "GroupInServiceInstances", "GroupMaxSize", "GroupMinSize", "GroupPendingInstances", "GroupStandbyInstances", "GroupTerminatingInstances", "GroupTotalInstances"]
  launch_template {
    id      = aws_launch_template.nodes-eu-west-2a-sudoku-com.id
    version = aws_launch_template.nodes-eu-west-2a-sudoku-com.latest_version
  }
  max_instance_lifetime = 0
  max_size              = 2
  metrics_granularity   = "1Minute"
  min_size              = 0
  name                  = "nodes-eu-west-2a.sudoku.org"
  protect_from_scale_in = false
  tag {
    key                 = "KubernetesCluster"
    propagate_at_launch = true
    value               = "sudoku.org"
  }
  tag {
    key                 = "Name"
    propagate_at_launch = true
    value               = "nodes-eu-west-2a.sudoku.org"
  }
  tag {
    key                 = "aws-node-termination-handler/managed"
    propagate_at_launch = true
    value               = ""
  }
  tag {
    key                 = "k8s.io/cluster-autoscaler/node-template/label/kops.k8s.io/instancegroup"
    propagate_at_launch = true
    value               = "nodes-eu-west-2a"
  }
  tag {
    key                 = "k8s.io/cluster-autoscaler/node-template/label/node-role.kubernetes.io/node"
    propagate_at_launch = true
    value               = ""
  }
  tag {
    key                 = "k8s.io/role/node"
    propagate_at_launch = true
    value               = "1"
  }
  tag {
    key                 = "kops.k8s.io/instancegroup"
    propagate_at_launch = true
    value               = "nodes-eu-west-2a"
  }
  tag {
    key                 = "kubernetes.io/cluster/sudoku.org"
    propagate_at_launch = true
    value               = "owned"
  }
  vpc_zone_identifier = [aws_subnet.eu-west-2a-sudoku-com.id]
}

resource "aws_autoscaling_group" "spot-eu-west-2a-sudoku-com" {
  enabled_metrics       = ["GroupDesiredCapacity", "GroupInServiceInstances", "GroupMaxSize", "GroupMinSize", "GroupPendingInstances", "GroupStandbyInstances", "GroupTerminatingInstances", "GroupTotalInstances"]
  max_instance_lifetime = 0
  max_size              = 3
  metrics_granularity   = "1Minute"
  min_size              = 1
  mixed_instances_policy {
    instances_distribution {
      on_demand_base_capacity                  = 0
      on_demand_percentage_above_base_capacity = 0
      spot_allocation_strategy                 = "capacity-optimized"
      spot_max_price                           = ""
    }
    launch_template {
      launch_template_specification {
        launch_template_id = aws_launch_template.spot-eu-west-2a-sudoku-com.id
        version            = aws_launch_template.spot-eu-west-2a-sudoku-com.latest_version
      }
      override {
        instance_type = "t3.medium"
      }
    }
  }
  name                  = "spot-eu-west-2a.sudoku.org"
  protect_from_scale_in = false
  tag {
    key                 = "KubernetesCluster"
    propagate_at_launch = true
    value               = "sudoku.org"
  }
  tag {
    key                 = "Name"
    propagate_at_launch = true
    value               = "spot-eu-west-2a.sudoku.org"
  }
  tag {
    key                 = "aws-node-termination-handler/managed"
    propagate_at_launch = true
    value               = ""
  }
  tag {
    key                 = "k8s.io/cluster-autoscaler/sudoku.org"
    propagate_at_launch = true
    value               = "1"
  }
  tag {
    key                 = "k8s.io/cluster-autoscaler/enabled"
    propagate_at_launch = true
    value               = "1"
  }
  tag {
    key                 = "k8s.io/cluster-autoscaler/node-template/label/kops.k8s.io/instancegroup"
    propagate_at_launch = true
    value               = "spot-eu-west-2a"
  }
  tag {
    key                 = "k8s.io/cluster-autoscaler/node-template/label/node-role.kubernetes.io/node"
    propagate_at_launch = true
    value               = ""
  }
  tag {
    key                 = "k8s.io/role/node"
    propagate_at_launch = true
    value               = "1"
  }
  tag {
    key                 = "kops.k8s.io/instancegroup"
    propagate_at_launch = true
    value               = "spot-eu-west-2a"
  }
  tag {
    key                 = "kubernetes.io/cluster/sudoku.org"
    propagate_at_launch = true
    value               = "owned"
  }
  vpc_zone_identifier = [aws_subnet.eu-west-2a-sudoku-com.id]
}

resource "aws_autoscaling_lifecycle_hook" "master-eu-west-2a-NTHLifecycleHook" {
  autoscaling_group_name = aws_autoscaling_group.master-eu-west-2a-masters-sudoku-com.id
  default_result         = "CONTINUE"
  heartbeat_timeout      = 300
  lifecycle_transition   = "autoscaling:EC2_INSTANCE_TERMINATING"
  name                   = "master-eu-west-2a-NTHLifecycleHook"
}

resource "aws_autoscaling_lifecycle_hook" "nodes-eu-west-2a-NTHLifecycleHook" {
  autoscaling_group_name = aws_autoscaling_group.nodes-eu-west-2a-sudoku-com.id
  default_result         = "CONTINUE"
  heartbeat_timeout      = 300
  lifecycle_transition   = "autoscaling:EC2_INSTANCE_TERMINATING"
  name                   = "nodes-eu-west-2a-NTHLifecycleHook"
}

resource "aws_autoscaling_lifecycle_hook" "spot-eu-west-2a-NTHLifecycleHook" {
  autoscaling_group_name = aws_autoscaling_group.spot-eu-west-2a-sudoku-com.id
  default_result         = "CONTINUE"
  heartbeat_timeout      = 300
  lifecycle_transition   = "autoscaling:EC2_INSTANCE_TERMINATING"
  name                   = "spot-eu-west-2a-NTHLifecycleHook"
}

resource "aws_cloudwatch_event_rule" "sudoku-com-ASGLifecycle" {
  event_pattern = file("${path.module}/data/aws_cloudwatch_event_rule_sudoku.org-ASGLifecycle_event_pattern")
  name          = "sudoku.org-ASGLifecycle"
  tags = {
    "KubernetesCluster"                   = "sudoku.org"
    "Name"                                = "sudoku.org-ASGLifecycle"
    "kubernetes.io/cluster/sudoku.org" = "owned"
  }
}

resource "aws_cloudwatch_event_rule" "sudoku-com-InstanceScheduledChange" {
  event_pattern = file("${path.module}/data/aws_cloudwatch_event_rule_sudoku.org-InstanceScheduledChange_event_pattern")
  name          = "sudoku.org-InstanceScheduledChange"
  tags = {
    "KubernetesCluster"                   = "sudoku.org"
    "Name"                                = "sudoku.org-InstanceScheduledChange"
    "kubernetes.io/cluster/sudoku.org" = "owned"
  }
}

resource "aws_cloudwatch_event_rule" "sudoku-com-InstanceStateChange" {
  event_pattern = file("${path.module}/data/aws_cloudwatch_event_rule_sudoku.org-InstanceStateChange_event_pattern")
  name          = "sudoku.org-InstanceStateChange"
  tags = {
    "KubernetesCluster"                   = "sudoku.org"
    "Name"                                = "sudoku.org-InstanceStateChange"
    "kubernetes.io/cluster/sudoku.org" = "owned"
  }
}

resource "aws_cloudwatch_event_rule" "sudoku-com-SpotInterruption" {
  event_pattern = file("${path.module}/data/aws_cloudwatch_event_rule_sudoku.org-SpotInterruption_event_pattern")
  name          = "sudoku.org-SpotInterruption"
  tags = {
    "KubernetesCluster"                   = "sudoku.org"
    "Name"                                = "sudoku.org-SpotInterruption"
    "kubernetes.io/cluster/sudoku.org" = "owned"
  }
}

resource "aws_cloudwatch_event_target" "sudoku-com-ASGLifecycle-Target" {
  arn  = aws_sqs_queue.sudoku-com-nth.arn
  rule = aws_cloudwatch_event_rule.sudoku-com-ASGLifecycle.id
}

resource "aws_cloudwatch_event_target" "sudoku-com-InstanceScheduledChange-Target" {
  arn  = aws_sqs_queue.sudoku-com-nth.arn
  rule = aws_cloudwatch_event_rule.sudoku-com-InstanceScheduledChange.id
}

resource "aws_cloudwatch_event_target" "sudoku-com-InstanceStateChange-Target" {
  arn  = aws_sqs_queue.sudoku-com-nth.arn
  rule = aws_cloudwatch_event_rule.sudoku-com-InstanceStateChange.id
}

resource "aws_cloudwatch_event_target" "sudoku-com-SpotInterruption-Target" {
  arn  = aws_sqs_queue.sudoku-com-nth.arn
  rule = aws_cloudwatch_event_rule.sudoku-com-SpotInterruption.id
}

resource "aws_ebs_volume" "a-etcd-events-sudoku-com" {
  availability_zone = "eu-west-2a"
  encrypted         = true
  iops              = 3000
  size              = 20
  tags = {
    "KubernetesCluster"                   = "sudoku.org"
    "Name"                                = "a.etcd-events.sudoku.org"
    "k8s.io/etcd/events"                  = "a/a"
    "k8s.io/role/control-plane"           = "1"
    "k8s.io/role/master"                  = "1"
    "kubernetes.io/cluster/sudoku.org" = "owned"
  }
  throughput = 125
  type       = "gp3"
}

resource "aws_ebs_volume" "a-etcd-main-sudoku-com" {
  availability_zone = "eu-west-2a"
  encrypted         = true
  iops              = 3000
  size              = 20
  tags = {
    "KubernetesCluster"                   = "sudoku.org"
    "Name"                                = "a.etcd-main.sudoku.org"
    "k8s.io/etcd/main"                    = "a/a"
    "k8s.io/role/control-plane"           = "1"
    "k8s.io/role/master"                  = "1"
    "kubernetes.io/cluster/sudoku.org" = "owned"
  }
  throughput = 125
  type       = "gp3"
}

resource "aws_eip" "eu-west-2a-sudoku-com" {
  tags = {
    "KubernetesCluster"                   = "sudoku.org"
    "Name"                                = "eu-west-2a.sudoku.org"
    "kubernetes.io/cluster/sudoku.org" = "owned"
  }
  vpc = true
}

resource "aws_elb" "api-sudoku-com" {
  connection_draining         = true
  connection_draining_timeout = 300
  cross_zone_load_balancing   = false
  health_check {
    healthy_threshold   = 2
    interval            = 10
    target              = "SSL:443"
    timeout             = 5
    unhealthy_threshold = 2
  }
  idle_timeout = 300
  listener {
    instance_port     = 443
    instance_protocol = "TCP"
    lb_port           = 443
    lb_protocol       = "TCP"
  }
  name            = "api-sudoku-com-m23sk8"
  security_groups = [aws_security_group.api-elb-sudoku-com.id]
  subnets         = [aws_subnet.utility-eu-west-2a-sudoku-com.id]
  tags = {
    "KubernetesCluster"                   = "sudoku.org"
    "Name"                                = "api.sudoku.org"
    "kubernetes.io/cluster/sudoku.org" = "owned"
  }
}

resource "aws_iam_instance_profile" "masters-sudoku-com" {
  name = "masters.sudoku.org"
  role = aws_iam_role.masters-sudoku-com.name
  tags = {
    "KubernetesCluster"                   = "sudoku.org"
    "Name"                                = "masters.sudoku.org"
    "kubernetes.io/cluster/sudoku.org" = "owned"
  }
}

resource "aws_iam_instance_profile" "nodes-sudoku-com" {
  name = "nodes.sudoku.org"
  role = aws_iam_role.nodes-sudoku-com.name
  tags = {
    "KubernetesCluster"                   = "sudoku.org"
    "Name"                                = "nodes.sudoku.org"
    "kubernetes.io/cluster/sudoku.org" = "owned"
  }
}

resource "aws_iam_role" "masters-sudoku-com" {
  assume_role_policy = file("${path.module}/data/aws_iam_role_masters.sudoku.org_policy")
  name               = "masters.sudoku.org"
  tags = {
    "KubernetesCluster"                   = "sudoku.org"
    "Name"                                = "masters.sudoku.org"
    "kubernetes.io/cluster/sudoku.org" = "owned"
  }
}

resource "aws_iam_role" "nodes-sudoku-com" {
  assume_role_policy = file("${path.module}/data/aws_iam_role_nodes.sudoku.org_policy")
  name               = "nodes.sudoku.org"
  tags = {
    "KubernetesCluster"                   = "sudoku.org"
    "Name"                                = "nodes.sudoku.org"
    "kubernetes.io/cluster/sudoku.org" = "owned"
  }
}

resource "aws_iam_role_policy" "additional-nodes-sudoku-com" {
  name   = "additional.nodes.sudoku.org"
  policy = file("${path.module}/data/aws_iam_role_policy_additional.nodes.sudoku.org_policy")
  role   = aws_iam_role.nodes-sudoku-com.name
}

resource "aws_iam_role_policy" "masters-sudoku-com" {
  name   = "masters.sudoku.org"
  policy = file("${path.module}/data/aws_iam_role_policy_masters.sudoku.org_policy")
  role   = aws_iam_role.masters-sudoku-com.name
}

resource "aws_iam_role_policy" "nodes-sudoku-com" {
  name   = "nodes.sudoku.org"
  policy = file("${path.module}/data/aws_iam_role_policy_nodes.sudoku.org_policy")
  role   = aws_iam_role.nodes-sudoku-com.name
}

resource "aws_internet_gateway" "sudoku-com" {
  tags = {
    "KubernetesCluster"                   = "sudoku.org"
    "Name"                                = "sudoku.org"
    "kubernetes.io/cluster/sudoku.org" = "owned"
  }
  vpc_id = aws_vpc.sudoku-com.id
}

resource "aws_key_pair" "kubernetes-sudoku-com-78a031403714e9858fa8fb039d055112" {
  key_name   = "kubernetes.sudoku.org-78:a0:31:40:37:14:e9:85:8f:a8:fb:03:9d:05:51:12"
  public_key = file("${path.module}/data/aws_key_pair_kubernetes.sudoku.org-78a031403714e9858fa8fb039d055112_public_key")
  tags = {
    "KubernetesCluster"                   = "sudoku.org"
    "Name"                                = "sudoku.org"
    "kubernetes.io/cluster/sudoku.org" = "owned"
  }
}

resource "aws_launch_template" "master-eu-west-2a-masters-sudoku-com" {
  block_device_mappings {
    device_name = "/dev/sda1"
    ebs {
      delete_on_termination = true
      encrypted             = true
      iops                  = 3000
      throughput            = 125
      volume_size           = 64
      volume_type           = "gp3"
    }
  }
  iam_instance_profile {
    name = aws_iam_instance_profile.masters-sudoku-com.id
  }
  image_id      = "ami-0d78429fb6af30994"
  instance_type = "t3.medium"
  key_name      = aws_key_pair.kubernetes-sudoku-com-78a031403714e9858fa8fb039d055112.id
  lifecycle {
    create_before_destroy = true
  }
  metadata_options {
    http_endpoint               = "enabled"
    http_protocol_ipv6          = "disabled"
    http_put_response_hop_limit = 3
    http_tokens                 = "required"
  }
  monitoring {
    enabled = false
  }
  name = "master-eu-west-2a.masters.sudoku.org"
  network_interfaces {
    associate_public_ip_address = false
    delete_on_termination       = true
    ipv6_address_count          = 0
    security_groups             = [aws_security_group.masters-sudoku-com.id]
  }
  tag_specifications {
    resource_type = "instance"
    tags = {
      "KubernetesCluster"                                                                                     = "sudoku.org"
      "Name"                                                                                                  = "master-eu-west-2a.masters.sudoku.org"
      "aws-node-termination-handler/managed"                                                                  = ""
      "k8s.io/cluster-autoscaler/node-template/label/kops.k8s.io/instancegroup"                               = "master-eu-west-2a"
      "k8s.io/cluster-autoscaler/node-template/label/kops.k8s.io/kops-controller-pki"                         = ""
      "k8s.io/cluster-autoscaler/node-template/label/node-role.kubernetes.io/control-plane"                   = ""
      "k8s.io/cluster-autoscaler/node-template/label/node.kubernetes.io/exclude-from-external-load-balancers" = ""
      "k8s.io/role/control-plane"                                                                             = "1"
      "k8s.io/role/master"                                                                                    = "1"
      "kops.k8s.io/instancegroup"                                                                             = "master-eu-west-2a"
      "kubernetes.io/cluster/sudoku.org"                                                                   = "owned"
    }
  }
  tag_specifications {
    resource_type = "volume"
    tags = {
      "KubernetesCluster"                                                                                     = "sudoku.org"
      "Name"                                                                                                  = "master-eu-west-2a.masters.sudoku.org"
      "aws-node-termination-handler/managed"                                                                  = ""
      "k8s.io/cluster-autoscaler/node-template/label/kops.k8s.io/instancegroup"                               = "master-eu-west-2a"
      "k8s.io/cluster-autoscaler/node-template/label/kops.k8s.io/kops-controller-pki"                         = ""
      "k8s.io/cluster-autoscaler/node-template/label/node-role.kubernetes.io/control-plane"                   = ""
      "k8s.io/cluster-autoscaler/node-template/label/node.kubernetes.io/exclude-from-external-load-balancers" = ""
      "k8s.io/role/control-plane"                                                                             = "1"
      "k8s.io/role/master"                                                                                    = "1"
      "kops.k8s.io/instancegroup"                                                                             = "master-eu-west-2a"
      "kubernetes.io/cluster/sudoku.org"                                                                   = "owned"
    }
  }
  tags = {
    "KubernetesCluster"                                                                                     = "sudoku.org"
    "Name"                                                                                                  = "master-eu-west-2a.masters.sudoku.org"
    "aws-node-termination-handler/managed"                                                                  = ""
    "k8s.io/cluster-autoscaler/node-template/label/kops.k8s.io/instancegroup"                               = "master-eu-west-2a"
    "k8s.io/cluster-autoscaler/node-template/label/kops.k8s.io/kops-controller-pki"                         = ""
    "k8s.io/cluster-autoscaler/node-template/label/node-role.kubernetes.io/control-plane"                   = ""
    "k8s.io/cluster-autoscaler/node-template/label/node.kubernetes.io/exclude-from-external-load-balancers" = ""
    "k8s.io/role/control-plane"                                                                             = "1"
    "k8s.io/role/master"                                                                                    = "1"
    "kops.k8s.io/instancegroup"                                                                             = "master-eu-west-2a"
    "kubernetes.io/cluster/sudoku.org"                                                                   = "owned"
  }
  user_data = filebase64("${path.module}/data/aws_launch_template_master-eu-west-2a.masters.sudoku.org_user_data")
}

resource "aws_launch_template" "nodes-eu-west-2a-sudoku-com" {
  block_device_mappings {
    device_name = "/dev/sda1"
    ebs {
      delete_on_termination = true
      encrypted             = true
      iops                  = 3000
      throughput            = 125
      volume_size           = 128
      volume_type           = "gp3"
    }
  }
  iam_instance_profile {
    name = aws_iam_instance_profile.nodes-sudoku-com.id
  }
  image_id      = "ami-0d78429fb6af30994"
  instance_type = "t3.medium"
  key_name      = aws_key_pair.kubernetes-sudoku-com-78a031403714e9858fa8fb039d055112.id
  lifecycle {
    create_before_destroy = true
  }
  metadata_options {
    http_endpoint               = "enabled"
    http_protocol_ipv6          = "disabled"
    http_put_response_hop_limit = 1
    http_tokens                 = "required"
  }
  monitoring {
    enabled = false
  }
  name = "nodes-eu-west-2a.sudoku.org"
  network_interfaces {
    associate_public_ip_address = false
    delete_on_termination       = true
    ipv6_address_count          = 0
    security_groups             = [aws_security_group.nodes-sudoku-com.id]
  }
  tag_specifications {
    resource_type = "instance"
    tags = {
      "KubernetesCluster"                                                          = "sudoku.org"
      "Name"                                                                       = "nodes-eu-west-2a.sudoku.org"
      "aws-node-termination-handler/managed"                                       = ""
      "k8s.io/cluster-autoscaler/node-template/label/kops.k8s.io/instancegroup"    = "nodes-eu-west-2a"
      "k8s.io/cluster-autoscaler/node-template/label/node-role.kubernetes.io/node" = ""
      "k8s.io/role/node"                                                           = "1"
      "kops.k8s.io/instancegroup"                                                  = "nodes-eu-west-2a"
      "kubernetes.io/cluster/sudoku.org"                                        = "owned"
    }
  }
  tag_specifications {
    resource_type = "volume"
    tags = {
      "KubernetesCluster"                                                          = "sudoku.org"
      "Name"                                                                       = "nodes-eu-west-2a.sudoku.org"
      "aws-node-termination-handler/managed"                                       = ""
      "k8s.io/cluster-autoscaler/node-template/label/kops.k8s.io/instancegroup"    = "nodes-eu-west-2a"
      "k8s.io/cluster-autoscaler/node-template/label/node-role.kubernetes.io/node" = ""
      "k8s.io/role/node"                                                           = "1"
      "kops.k8s.io/instancegroup"                                                  = "nodes-eu-west-2a"
      "kubernetes.io/cluster/sudoku.org"                                        = "owned"
    }
  }
  tags = {
    "KubernetesCluster"                                                          = "sudoku.org"
    "Name"                                                                       = "nodes-eu-west-2a.sudoku.org"
    "aws-node-termination-handler/managed"                                       = ""
    "k8s.io/cluster-autoscaler/node-template/label/kops.k8s.io/instancegroup"    = "nodes-eu-west-2a"
    "k8s.io/cluster-autoscaler/node-template/label/node-role.kubernetes.io/node" = ""
    "k8s.io/role/node"                                                           = "1"
    "kops.k8s.io/instancegroup"                                                  = "nodes-eu-west-2a"
    "kubernetes.io/cluster/sudoku.org"                                        = "owned"
  }
  user_data = filebase64("${path.module}/data/aws_launch_template_nodes-eu-west-2a.sudoku.org_user_data")
}

resource "aws_launch_template" "spot-eu-west-2a-sudoku-com" {
  block_device_mappings {
    device_name = "/dev/sda1"
    ebs {
      delete_on_termination = true
      encrypted             = true
      iops                  = 3000
      throughput            = 125
      volume_size           = 128
      volume_type           = "gp3"
    }
  }
  iam_instance_profile {
    name = aws_iam_instance_profile.nodes-sudoku-com.id
  }
  image_id      = "ami-0d78429fb6af30994"
  instance_type = "t3.medium"
  key_name      = aws_key_pair.kubernetes-sudoku-com-78a031403714e9858fa8fb039d055112.id
  lifecycle {
    create_before_destroy = true
  }
  metadata_options {
    http_endpoint               = "enabled"
    http_protocol_ipv6          = "disabled"
    http_put_response_hop_limit = 1
    http_tokens                 = "optional"
  }
  monitoring {
    enabled = false
  }
  name = "spot-eu-west-2a.sudoku.org"
  network_interfaces {
    associate_public_ip_address = false
    delete_on_termination       = true
    ipv6_address_count          = 0
    security_groups             = [aws_security_group.nodes-sudoku-com.id]
  }
  tag_specifications {
    resource_type = "instance"
    tags = {
      "KubernetesCluster"                                                          = "sudoku.org"
      "Name"                                                                       = "spot-eu-west-2a.sudoku.org"
      "aws-node-termination-handler/managed"                                       = ""
      "k8s.io/cluster-autoscaler/sudoku.org"                                    = "1"
      "k8s.io/cluster-autoscaler/enabled"                                          = "1"
      "k8s.io/cluster-autoscaler/node-template/label/kops.k8s.io/instancegroup"    = "spot-eu-west-2a"
      "k8s.io/cluster-autoscaler/node-template/label/node-role.kubernetes.io/node" = ""
      "k8s.io/role/node"                                                           = "1"
      "kops.k8s.io/instancegroup"                                                  = "spot-eu-west-2a"
      "kubernetes.io/cluster/sudoku.org"                                        = "owned"
    }
  }
  tag_specifications {
    resource_type = "volume"
    tags = {
      "KubernetesCluster"                                                          = "sudoku.org"
      "Name"                                                                       = "spot-eu-west-2a.sudoku.org"
      "aws-node-termination-handler/managed"                                       = ""
      "k8s.io/cluster-autoscaler/sudoku.org"                                    = "1"
      "k8s.io/cluster-autoscaler/enabled"                                          = "1"
      "k8s.io/cluster-autoscaler/node-template/label/kops.k8s.io/instancegroup"    = "spot-eu-west-2a"
      "k8s.io/cluster-autoscaler/node-template/label/node-role.kubernetes.io/node" = ""
      "k8s.io/role/node"                                                           = "1"
      "kops.k8s.io/instancegroup"                                                  = "spot-eu-west-2a"
      "kubernetes.io/cluster/sudoku.org"                                        = "owned"
    }
  }
  tags = {
    "KubernetesCluster"                                                          = "sudoku.org"
    "Name"                                                                       = "spot-eu-west-2a.sudoku.org"
    "aws-node-termination-handler/managed"                                       = ""
    "k8s.io/cluster-autoscaler/sudoku.org"                                    = "1"
    "k8s.io/cluster-autoscaler/enabled"                                          = "1"
    "k8s.io/cluster-autoscaler/node-template/label/kops.k8s.io/instancegroup"    = "spot-eu-west-2a"
    "k8s.io/cluster-autoscaler/node-template/label/node-role.kubernetes.io/node" = ""
    "k8s.io/role/node"                                                           = "1"
    "kops.k8s.io/instancegroup"                                                  = "spot-eu-west-2a"
    "kubernetes.io/cluster/sudoku.org"                                        = "owned"
  }
  user_data = filebase64("${path.module}/data/aws_launch_template_spot-eu-west-2a.sudoku.org_user_data")
}

resource "aws_nat_gateway" "eu-west-2a-sudoku-com" {
  allocation_id = aws_eip.eu-west-2a-sudoku-com.id
  subnet_id     = aws_subnet.utility-eu-west-2a-sudoku-com.id
  tags = {
    "KubernetesCluster"                   = "sudoku.org"
    "Name"                                = "eu-west-2a.sudoku.org"
    "kubernetes.io/cluster/sudoku.org" = "owned"
  }
}

resource "aws_route" "route-0-0-0-0--0" {
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.sudoku-com.id
  route_table_id         = aws_route_table.sudoku-com.id
}

resource "aws_route" "route-__--0" {
  destination_ipv6_cidr_block = "::/0"
  gateway_id                  = aws_internet_gateway.sudoku-com.id
  route_table_id              = aws_route_table.sudoku-com.id
}

resource "aws_route" "route-private-eu-west-2a-0-0-0-0--0" {
  destination_cidr_block = "0.0.0.0/0"
  nat_gateway_id         = aws_nat_gateway.eu-west-2a-sudoku-com.id
  route_table_id         = aws_route_table.private-eu-west-2a-sudoku-com.id
}

resource "aws_route53_record" "api-sudoku-com" {
  alias {
    evaluate_target_health = false
    name                   = aws_elb.api-sudoku-com.dns_name
    zone_id                = aws_elb.api-sudoku-com.zone_id
  }
  name    = "api.sudoku.org"
  type    = "A"
  zone_id = "/hostedzone/Z06490773QB48ZZFDXBYU"
}

resource "aws_route_table" "sudoku-com" {
  tags = {
    "KubernetesCluster"                   = "sudoku.org"
    "Name"                                = "sudoku.org"
    "kubernetes.io/cluster/sudoku.org" = "owned"
    "kubernetes.io/kops/role"             = "public"
  }
  vpc_id = aws_vpc.sudoku-com.id
}

resource "aws_route_table" "private-eu-west-2a-sudoku-com" {
  tags = {
    "KubernetesCluster"                   = "sudoku.org"
    "Name"                                = "private-eu-west-2a.sudoku.org"
    "kubernetes.io/cluster/sudoku.org" = "owned"
    "kubernetes.io/kops/role"             = "private-eu-west-2a"
  }
  vpc_id = aws_vpc.sudoku-com.id
}

resource "aws_route_table_association" "private-eu-west-2a-sudoku-com" {
  route_table_id = aws_route_table.private-eu-west-2a-sudoku-com.id
  subnet_id      = aws_subnet.eu-west-2a-sudoku-com.id
}

resource "aws_route_table_association" "utility-eu-west-2a-sudoku-com" {
  route_table_id = aws_route_table.sudoku-com.id
  subnet_id      = aws_subnet.utility-eu-west-2a-sudoku-com.id
}

resource "aws_s3_object" "sudoku-com-addons-aws-cloud-controller-addons-k8s-io-k8s-1-18" {
  bucket   = "sudoku-k8s-kops-store"
  content  = file("${path.module}/data/aws_s3_object_sudoku.org-addons-aws-cloud-controller.addons.k8s.io-k8s-1.18_content")
  key      = "sudoku.org/addons/aws-cloud-controller.addons.k8s.io/k8s-1.18.yaml"
  provider = aws.files
}

resource "aws_s3_object" "sudoku-com-addons-aws-ebs-csi-driver-addons-k8s-io-k8s-1-17" {
  bucket   = "sudoku-k8s-kops-store"
  content  = file("${path.module}/data/aws_s3_object_sudoku.org-addons-aws-ebs-csi-driver.addons.k8s.io-k8s-1.17_content")
  key      = "sudoku.org/addons/aws-ebs-csi-driver.addons.k8s.io/k8s-1.17.yaml"
  provider = aws.files
}

resource "aws_s3_object" "sudoku-com-addons-bootstrap" {
  bucket   = "sudoku-k8s-kops-store"
  content  = file("${path.module}/data/aws_s3_object_sudoku.org-addons-bootstrap_content")
  key      = "sudoku.org/addons/bootstrap-channel.yaml"
  provider = aws.files
}

resource "aws_s3_object" "sudoku-com-addons-coredns-addons-k8s-io-k8s-1-12" {
  bucket   = "sudoku-k8s-kops-store"
  content  = file("${path.module}/data/aws_s3_object_sudoku.org-addons-coredns.addons.k8s.io-k8s-1.12_content")
  key      = "sudoku.org/addons/coredns.addons.k8s.io/k8s-1.12.yaml"
  provider = aws.files
}

resource "aws_s3_object" "sudoku-com-addons-dns-controller-addons-k8s-io-k8s-1-12" {
  bucket   = "sudoku-k8s-kops-store"
  content  = file("${path.module}/data/aws_s3_object_sudoku.org-addons-dns-controller.addons.k8s.io-k8s-1.12_content")
  key      = "sudoku.org/addons/dns-controller.addons.k8s.io/k8s-1.12.yaml"
  provider = aws.files
}

resource "aws_s3_object" "sudoku-com-addons-kops-controller-addons-k8s-io-k8s-1-16" {
  bucket   = "sudoku-k8s-kops-store"
  content  = file("${path.module}/data/aws_s3_object_sudoku.org-addons-kops-controller.addons.k8s.io-k8s-1.16_content")
  key      = "sudoku.org/addons/kops-controller.addons.k8s.io/k8s-1.16.yaml"
  provider = aws.files
}

resource "aws_s3_object" "sudoku-com-addons-kubelet-api-rbac-addons-k8s-io-k8s-1-9" {
  bucket   = "sudoku-k8s-kops-store"
  content  = file("${path.module}/data/aws_s3_object_sudoku.org-addons-kubelet-api.rbac.addons.k8s.io-k8s-1.9_content")
  key      = "sudoku.org/addons/kubelet-api.rbac.addons.k8s.io/k8s-1.9.yaml"
  provider = aws.files
}

resource "aws_s3_object" "sudoku-com-addons-limit-range-addons-k8s-io" {
  bucket   = "sudoku-k8s-kops-store"
  content  = file("${path.module}/data/aws_s3_object_sudoku.org-addons-limit-range.addons.k8s.io_content")
  key      = "sudoku.org/addons/limit-range.addons.k8s.io/v1.5.0.yaml"
  provider = aws.files
}

resource "aws_s3_object" "sudoku-com-addons-networking-projectcalico-org-k8s-1-25" {
  bucket   = "sudoku-k8s-kops-store"
  content  = file("${path.module}/data/aws_s3_object_sudoku.org-addons-networking.projectcalico.org-k8s-1.25_content")
  key      = "sudoku.org/addons/networking.projectcalico.org/k8s-1.25.yaml"
  provider = aws.files
}

resource "aws_s3_object" "sudoku-com-addons-node-termination-handler-aws-k8s-1-11" {
  bucket   = "sudoku-k8s-kops-store"
  content  = file("${path.module}/data/aws_s3_object_sudoku.org-addons-node-termination-handler.aws-k8s-1.11_content")
  key      = "sudoku.org/addons/node-termination-handler.aws/k8s-1.11.yaml"
  provider = aws.files
}

resource "aws_s3_object" "sudoku-com-addons-storage-aws-addons-k8s-io-v1-15-0" {
  bucket   = "sudoku-k8s-kops-store"
  content  = file("${path.module}/data/aws_s3_object_sudoku.org-addons-storage-aws.addons.k8s.io-v1.15.0_content")
  key      = "sudoku.org/addons/storage-aws.addons.k8s.io/v1.15.0.yaml"
  provider = aws.files
}

resource "aws_s3_object" "cluster-completed-spec" {
  bucket   = "sudoku-k8s-kops-store"
  content  = file("${path.module}/data/aws_s3_object_cluster-completed.spec_content")
  key      = "sudoku.org/cluster-completed.spec"
  provider = aws.files
}

resource "aws_s3_object" "etcd-cluster-spec-events" {
  bucket   = "sudoku-k8s-kops-store"
  content  = file("${path.module}/data/aws_s3_object_etcd-cluster-spec-events_content")
  key      = "sudoku.org/backups/etcd/events/control/etcd-cluster-spec"
  provider = aws.files
}

resource "aws_s3_object" "etcd-cluster-spec-main" {
  bucket   = "sudoku-k8s-kops-store"
  content  = file("${path.module}/data/aws_s3_object_etcd-cluster-spec-main_content")
  key      = "sudoku.org/backups/etcd/main/control/etcd-cluster-spec"
  provider = aws.files
}

resource "aws_s3_object" "kops-version-txt" {
  bucket   = "sudoku-k8s-kops-store"
  content  = file("${path.module}/data/aws_s3_object_kops-version.txt_content")
  key      = "sudoku.org/kops-version.txt"
  provider = aws.files
}

resource "aws_s3_object" "manifests-etcdmanager-events-master-eu-west-2a" {
  bucket   = "sudoku-k8s-kops-store"
  content  = file("${path.module}/data/aws_s3_object_manifests-etcdmanager-events-master-eu-west-2a_content")
  key      = "sudoku.org/manifests/etcd/events-master-eu-west-2a.yaml"
  provider = aws.files
}

resource "aws_s3_object" "manifests-etcdmanager-main-master-eu-west-2a" {
  bucket   = "sudoku-k8s-kops-store"
  content  = file("${path.module}/data/aws_s3_object_manifests-etcdmanager-main-master-eu-west-2a_content")
  key      = "sudoku.org/manifests/etcd/main-master-eu-west-2a.yaml"
  provider = aws.files
}

resource "aws_s3_object" "manifests-static-kube-apiserver-healthcheck" {
  bucket   = "sudoku-k8s-kops-store"
  content  = file("${path.module}/data/aws_s3_object_manifests-static-kube-apiserver-healthcheck_content")
  key      = "sudoku.org/manifests/static/kube-apiserver-healthcheck.yaml"
  provider = aws.files
}

resource "aws_s3_object" "nodeupconfig-master-eu-west-2a" {
  bucket   = "sudoku-k8s-kops-store"
  content  = file("${path.module}/data/aws_s3_object_nodeupconfig-master-eu-west-2a_content")
  key      = "sudoku.org/igconfig/control-plane/master-eu-west-2a/nodeupconfig.yaml"
  provider = aws.files
}

resource "aws_s3_object" "nodeupconfig-nodes-eu-west-2a" {
  bucket   = "sudoku-k8s-kops-store"
  content  = file("${path.module}/data/aws_s3_object_nodeupconfig-nodes-eu-west-2a_content")
  key      = "sudoku.org/igconfig/node/nodes-eu-west-2a/nodeupconfig.yaml"
  provider = aws.files
}

resource "aws_s3_object" "nodeupconfig-spot-eu-west-2a" {
  bucket   = "sudoku-k8s-kops-store"
  content  = file("${path.module}/data/aws_s3_object_nodeupconfig-spot-eu-west-2a_content")
  key      = "sudoku.org/igconfig/node/spot-eu-west-2a/nodeupconfig.yaml"
  provider = aws.files
}

resource "aws_security_group" "api-elb-sudoku-com" {
  description = "Security group for api ELB"
  name        = "api-elb.sudoku.org"
  tags = {
    "KubernetesCluster"                   = "sudoku.org"
    "Name"                                = "api-elb.sudoku.org"
    "kubernetes.io/cluster/sudoku.org" = "owned"
  }
  vpc_id = aws_vpc.sudoku-com.id
}

resource "aws_security_group" "masters-sudoku-com" {
  description = "Security group for masters"
  name        = "masters.sudoku.org"
  tags = {
    "KubernetesCluster"                   = "sudoku.org"
    "Name"                                = "masters.sudoku.org"
    "kubernetes.io/cluster/sudoku.org" = "owned"
  }
  vpc_id = aws_vpc.sudoku-com.id
}

resource "aws_security_group" "nodes-sudoku-com" {
  description = "Security group for nodes"
  name        = "nodes.sudoku.org"
  tags = {
    "KubernetesCluster"                   = "sudoku.org"
    "Name"                                = "nodes.sudoku.org"
    "kubernetes.io/cluster/sudoku.org" = "owned"
  }
  vpc_id = aws_vpc.sudoku-com.id
}

resource "aws_security_group_rule" "from-0-0-0-0--0-ingress-tcp-22to22-masters-sudoku-com" {
  cidr_blocks       = ["0.0.0.0/0"]
  from_port         = 22
  protocol          = "tcp"
  security_group_id = aws_security_group.masters-sudoku-com.id
  to_port           = 22
  type              = "ingress"
}

resource "aws_security_group_rule" "from-0-0-0-0--0-ingress-tcp-22to22-nodes-sudoku-com" {
  cidr_blocks       = ["0.0.0.0/0"]
  from_port         = 22
  protocol          = "tcp"
  security_group_id = aws_security_group.nodes-sudoku-com.id
  to_port           = 22
  type              = "ingress"
}

resource "aws_security_group_rule" "from-0-0-0-0--0-ingress-tcp-443to443-api-elb-sudoku-com" {
  cidr_blocks       = ["0.0.0.0/0"]
  from_port         = 443
  protocol          = "tcp"
  security_group_id = aws_security_group.api-elb-sudoku-com.id
  to_port           = 443
  type              = "ingress"
}

resource "aws_security_group_rule" "from-__--0-ingress-tcp-22to22-masters-sudoku-com" {
  from_port         = 22
  ipv6_cidr_blocks  = ["::/0"]
  protocol          = "tcp"
  security_group_id = aws_security_group.masters-sudoku-com.id
  to_port           = 22
  type              = "ingress"
}

resource "aws_security_group_rule" "from-__--0-ingress-tcp-22to22-nodes-sudoku-com" {
  from_port         = 22
  ipv6_cidr_blocks  = ["::/0"]
  protocol          = "tcp"
  security_group_id = aws_security_group.nodes-sudoku-com.id
  to_port           = 22
  type              = "ingress"
}

resource "aws_security_group_rule" "from-__--0-ingress-tcp-443to443-api-elb-sudoku-com" {
  from_port         = 443
  ipv6_cidr_blocks  = ["::/0"]
  protocol          = "tcp"
  security_group_id = aws_security_group.api-elb-sudoku-com.id
  to_port           = 443
  type              = "ingress"
}

resource "aws_security_group_rule" "from-api-elb-sudoku-com-egress-all-0to0-0-0-0-0--0" {
  cidr_blocks       = ["0.0.0.0/0"]
  from_port         = 0
  protocol          = "-1"
  security_group_id = aws_security_group.api-elb-sudoku-com.id
  to_port           = 0
  type              = "egress"
}

resource "aws_security_group_rule" "from-api-elb-sudoku-com-egress-all-0to0-__--0" {
  from_port         = 0
  ipv6_cidr_blocks  = ["::/0"]
  protocol          = "-1"
  security_group_id = aws_security_group.api-elb-sudoku-com.id
  to_port           = 0
  type              = "egress"
}

resource "aws_security_group_rule" "from-masters-sudoku-com-egress-all-0to0-0-0-0-0--0" {
  cidr_blocks       = ["0.0.0.0/0"]
  from_port         = 0
  protocol          = "-1"
  security_group_id = aws_security_group.masters-sudoku-com.id
  to_port           = 0
  type              = "egress"
}

resource "aws_security_group_rule" "from-masters-sudoku-com-egress-all-0to0-__--0" {
  from_port         = 0
  ipv6_cidr_blocks  = ["::/0"]
  protocol          = "-1"
  security_group_id = aws_security_group.masters-sudoku-com.id
  to_port           = 0
  type              = "egress"
}

resource "aws_security_group_rule" "from-masters-sudoku-com-ingress-all-0to0-masters-sudoku-com" {
  from_port                = 0
  protocol                 = "-1"
  security_group_id        = aws_security_group.masters-sudoku-com.id
  source_security_group_id = aws_security_group.masters-sudoku-com.id
  to_port                  = 0
  type                     = "ingress"
}

resource "aws_security_group_rule" "from-masters-sudoku-com-ingress-all-0to0-nodes-sudoku-com" {
  from_port                = 0
  protocol                 = "-1"
  security_group_id        = aws_security_group.nodes-sudoku-com.id
  source_security_group_id = aws_security_group.masters-sudoku-com.id
  to_port                  = 0
  type                     = "ingress"
}

resource "aws_security_group_rule" "from-nodes-sudoku-com-egress-all-0to0-0-0-0-0--0" {
  cidr_blocks       = ["0.0.0.0/0"]
  from_port         = 0
  protocol          = "-1"
  security_group_id = aws_security_group.nodes-sudoku-com.id
  to_port           = 0
  type              = "egress"
}

resource "aws_security_group_rule" "from-nodes-sudoku-com-egress-all-0to0-__--0" {
  from_port         = 0
  ipv6_cidr_blocks  = ["::/0"]
  protocol          = "-1"
  security_group_id = aws_security_group.nodes-sudoku-com.id
  to_port           = 0
  type              = "egress"
}

resource "aws_security_group_rule" "from-nodes-sudoku-com-ingress-4-0to0-masters-sudoku-com" {
  from_port                = 0
  protocol                 = "4"
  security_group_id        = aws_security_group.masters-sudoku-com.id
  source_security_group_id = aws_security_group.nodes-sudoku-com.id
  to_port                  = 65535
  type                     = "ingress"
}

resource "aws_security_group_rule" "from-nodes-sudoku-com-ingress-all-0to0-nodes-sudoku-com" {
  from_port                = 0
  protocol                 = "-1"
  security_group_id        = aws_security_group.nodes-sudoku-com.id
  source_security_group_id = aws_security_group.nodes-sudoku-com.id
  to_port                  = 0
  type                     = "ingress"
}

resource "aws_security_group_rule" "from-nodes-sudoku-com-ingress-tcp-1to2379-masters-sudoku-com" {
  from_port                = 1
  protocol                 = "tcp"
  security_group_id        = aws_security_group.masters-sudoku-com.id
  source_security_group_id = aws_security_group.nodes-sudoku-com.id
  to_port                  = 2379
  type                     = "ingress"
}

resource "aws_security_group_rule" "from-nodes-sudoku-com-ingress-tcp-2382to4000-masters-sudoku-com" {
  from_port                = 2382
  protocol                 = "tcp"
  security_group_id        = aws_security_group.masters-sudoku-com.id
  source_security_group_id = aws_security_group.nodes-sudoku-com.id
  to_port                  = 4000
  type                     = "ingress"
}

resource "aws_security_group_rule" "from-nodes-sudoku-com-ingress-tcp-4003to65535-masters-sudoku-com" {
  from_port                = 4003
  protocol                 = "tcp"
  security_group_id        = aws_security_group.masters-sudoku-com.id
  source_security_group_id = aws_security_group.nodes-sudoku-com.id
  to_port                  = 65535
  type                     = "ingress"
}

resource "aws_security_group_rule" "from-nodes-sudoku-com-ingress-udp-1to65535-masters-sudoku-com" {
  from_port                = 1
  protocol                 = "udp"
  security_group_id        = aws_security_group.masters-sudoku-com.id
  source_security_group_id = aws_security_group.nodes-sudoku-com.id
  to_port                  = 65535
  type                     = "ingress"
}

resource "aws_security_group_rule" "https-elb-to-master" {
  from_port                = 443
  protocol                 = "tcp"
  security_group_id        = aws_security_group.masters-sudoku-com.id
  source_security_group_id = aws_security_group.api-elb-sudoku-com.id
  to_port                  = 443
  type                     = "ingress"
}

resource "aws_security_group_rule" "icmp-pmtu-api-elb-0-0-0-0--0" {
  cidr_blocks       = ["0.0.0.0/0"]
  from_port         = 3
  protocol          = "icmp"
  security_group_id = aws_security_group.api-elb-sudoku-com.id
  to_port           = 4
  type              = "ingress"
}

resource "aws_security_group_rule" "icmpv6-pmtu-api-elb-__--0" {
  from_port         = -1
  ipv6_cidr_blocks  = ["::/0"]
  protocol          = "icmpv6"
  security_group_id = aws_security_group.api-elb-sudoku-com.id
  to_port           = -1
  type              = "ingress"
}

resource "aws_sqs_queue" "sudoku-com-nth" {
  message_retention_seconds = 300
  name                      = "sudoku-com-nth"
  policy                    = file("${path.module}/data/aws_sqs_queue_sudoku-com-nth_policy")
  tags = {
    "KubernetesCluster"                   = "sudoku.org"
    "Name"                                = "sudoku-com-nth"
    "kubernetes.io/cluster/sudoku.org" = "owned"
  }
}

resource "aws_subnet" "eu-west-2a-sudoku-com" {
  availability_zone                           = "eu-west-2a"
  cidr_block                                  = "172.20.32.0/19"
  enable_resource_name_dns_a_record_on_launch = true
  private_dns_hostname_type_on_launch         = "resource-name"
  tags = {
    "KubernetesCluster"                            = "sudoku.org"
    "Name"                                         = "eu-west-2a.sudoku.org"
    "SubnetType"                                   = "Private"
    "kops.k8s.io/instance-group/master-eu-west-2a" = "true"
    "kops.k8s.io/instance-group/nodes-eu-west-2a"  = "true"
    "kops.k8s.io/instance-group/spot-eu-west-2a"   = "true"
    "kubernetes.io/cluster/sudoku.org"          = "owned"
    "kubernetes.io/role/internal-elb"              = "1"
  }
  vpc_id = aws_vpc.sudoku-com.id
}

resource "aws_subnet" "utility-eu-west-2a-sudoku-com" {
  availability_zone                           = "eu-west-2a"
  cidr_block                                  = "172.20.0.0/22"
  enable_resource_name_dns_a_record_on_launch = true
  private_dns_hostname_type_on_launch         = "resource-name"
  tags = {
    "KubernetesCluster"                   = "sudoku.org"
    "Name"                                = "utility-eu-west-2a.sudoku.org"
    "SubnetType"                          = "Utility"
    "kubernetes.io/cluster/sudoku.org" = "owned"
    "kubernetes.io/role/elb"              = "1"
  }
  vpc_id = aws_vpc.sudoku-com.id
}

resource "aws_vpc" "sudoku-com" {
  assign_generated_ipv6_cidr_block = true
  cidr_block                       = "172.20.0.0/16"
  enable_dns_hostnames             = true
  enable_dns_support               = true
  tags = {
    "KubernetesCluster"                   = "sudoku.org"
    "Name"                                = "sudoku.org"
    "kubernetes.io/cluster/sudoku.org" = "owned"
  }
}

resource "aws_vpc_dhcp_options" "sudoku-com" {
  domain_name         = "eu-west-2.compute.internal"
  domain_name_servers = ["AmazonProvidedDNS"]
  tags = {
    "KubernetesCluster"                   = "sudoku.org"
    "Name"                                = "sudoku.org"
    "kubernetes.io/cluster/sudoku.org" = "owned"
  }
}

resource "aws_vpc_dhcp_options_association" "sudoku-com" {
  dhcp_options_id = aws_vpc_dhcp_options.sudoku-com.id
  vpc_id          = aws_vpc.sudoku-com.id
}

terraform {
  required_version = ">= 0.15.0"
  required_providers {
    aws = {
      "configuration_aliases" = [aws.files]
      "source"                = "hashicorp/aws"
      "version"               = ">= 4.0.0"
    }
  }
}
