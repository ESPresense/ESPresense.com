---
title: FAQ
sidebar:
  order: 5
---


### What is the relevance and impact of floors for nodes? Why is the nearest floor shown after the floor it's on?

Basically, each floor is calculated separately. We add data from the nodes that are specified to include in the floor calculation.

The logic behind allowing nodes from other floors is that sometimes a node physically located on one floor (e.g., the 2nd floor) might still be "close enough" to provide useful data for another floor. For example, a node in the basement, positioned only a meter below the first floor, can contribute valuable information to the first floor's calculations.

For each floor, the system calculates a Bayesian probability (confidence level) indicating the likelihood that the device is on that specific floor. The companion app then displays the floor with the highest confidence level as the "best scenario" or most likely location for the device.
