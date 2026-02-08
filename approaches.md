---
layout: page
title: Two Ways to Use ESPresense
permalink: /approaches
nav_order: 2
---

# Two Ways to Use ESPresense

ESPresense supports two fundamentally different approaches to presence detection. Choosing the right one upfront will save you confusion and hardware costs.

---

## Quick Comparison

| | **mqtt_room** | **Companion** |
|:---|:---|:---|
| **Question Answered** | "Which room is my device in?" | "Where exactly is my device on the floor?" |
| **Output** | Room name (e.g., "kitchen") | X,Y coordinates on floor plan |
| **Nodes Needed** | 1 per room | 5-8 per floor |
| **Node Placement** | Where you want to detect | Perimeter + strategic points |
| **Setup Complexity** | Simple | More complex |
| **Use Case** | Room-based automations | Precise location tracking |

---

## Approach 1: mqtt_room (Simple)

**Best for:** Room-based automations like "turn on kitchen lights when I enter"

### How It Works

Your device connects to the **single nearest ESPresense node**. The node's configured room name is reported to Home Assistant.

```
Phone → "I'm 2m from Living Room node" 
      → HA sees "Phone is in Living Room"
```

### Node Placement

Place **one node per room** where you want detection:
- Center of room for best coverage
- Away from metal/obstacles if possible
- Each node = one room in your automation

### When to Use

- Turning lights on/off per room
- Playing announcements in specific rooms
- Basic presence detection
- **Start here if you're new to ESPresense**

### Important Notes

- **Only 1 node per room** - Multiple nodes in the same room cause flapping (device jumps between them)
- Nodes don't need to "see" each other
- No floor plan required

---

## Approach 2: Companion (Precise Positioning)

**Best for:** Precise location tracking like "find my phone on the floor plan"

### How It Works

Multiple nodes measure distance to your device simultaneously. Using **multilateration** (not triangulation), the Companion calculates precise X,Y coordinates.

```
Phone → 3m from Node A
      → 5m from Node B  
      → 4m from Node C
      → Companion calculates: Phone is at (X,Y)
```

### Node Placement

**Density:** 5-8 nodes per floor (depending on square footage)

**Strategy:**
- **Perimeter nodes help most** - They provide the strongest "pull" to the edges
- **Avoid collinearity** - Don't place nodes in a straight line; spread them in 2D space
- **Height matters** - Mount at consistent heights (ceiling preferred)

### Obstacles Matter

Walls, furniture, and people can **drastically affect positioning**. The system assumes line-of-sight or consistent absorption. In reality:
- A wall between node and device = longer apparent distance
- Multiple walls = even more error
- Consider this when placing nodes and interpreting results

### When to Use

- Finding exactly where someone is on a floor plan
- Tracking movement paths through house
- Room-level presence isn't enough
- You're willing to invest in 5-8+ nodes per floor

---

## Common Confusion

### "Can I start with mqtt_room and upgrade to Companion?"

Yes, but you'll likely need **more nodes** and **different placement**. mqtt_room uses 1 node per room. Companion needs dense coverage (5-8 per floor) with perimeter focus.

### "I have 3 nodes, why doesn't Companion work well?"

Three nodes can technically do multilateration, but:
- Coverage gaps cause lost tracking
- Obstacles create dead zones
- You need redundancy for accuracy

Companion really shines with **5-8 nodes minimum** per floor.

### "Should I put multiple nodes in one room for better mqtt_room?"

**No.** This causes the device to jump between nodes as signal fluctuates. mqtt_room works best with **exactly 1 node per room**.

### "My Companion positioning is off by several feet"

Check for:
1. **Collinearity** - Are your nodes in a straight line? Spread them out.
2. **Obstacles** - Walls between nodes and devices?
3. **Node count** - Do you have enough nodes for floor size?
4. **Calibration** - Have you calibrated distances? (See [Calibration Guide](/guides/calibration))

---

## Decision Flowchart

```
┌─────────────────────────────────────┐
│  Do you need precise location       │
│  on a floor plan?                   │
└──────────────┬──────────────────────┘
               │
       ┌───────┴────────┐
       │                │
      YES              NO
       │                │
       ▼                ▼
┌─────────────┐   ┌─────────────┐
│ Companion   │   │ mqtt_room   │
│ • 5-8 nodes │   │ • 1 node/   │
│   per floor │   │   room      │
│ • Floor     │   │ • Simple    │
│   plan req  │   │   setup     │
└─────────────┘   └─────────────┘
```

---

## Next Steps

**For mqtt_room:**
1. Flash 1 node per room
2. Configure room names in each node
3. Set up [mqtt_room integration](/integrations/home_assistant)

**For Companion:**
1. Plan node placement (perimeter + interior)
2. Flash 5-8 nodes per floor
3. Install [ESPresense Companion](/companion)
4. Import floor plan and position nodes
5. [Calibrate](/guides/calibration) for accuracy

---

## Can I Mix Both?

Yes! You can run mqtt_room on some nodes and use others with Companion. For example:
- **Companion nodes**: Living room, kitchen, hallway (precise tracking in common areas)
- **mqtt_room nodes**: Bedrooms, bathrooms (simple presence)

Just ensure mqtt_room nodes are NOT part of your Companion setup to avoid confusion.
