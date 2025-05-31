export const tabs = [
  {
    id: "active_projects",
    label: "Active Projects",
  },
  {
    id: "templates",
    label: "Templates",
  },
  {
    id: "archived",
    label: "Archived",
  },
  {
    id: "issues",
    label: "Issues",
  },
];

export const momTabs = [
  {
    id: "minutes_of_meeting",
    label: "Minutes Of Meeting",
  },
];

export const cardsTitle = [
  {
    id: 1,
    title: "Overdue",
    color: "#FF2733",
    add: false,
  },
  {
    id: 2,
    title: "Open",
    color: "#E4636A",
    add: true,
  },
  {
    id: 3,
    title: "In Progress",
    color: "#08AEEA",
    add: true,
  },
  {
    id: 4,
    title: "On Hold",
    color: "#7BD2B5",
    add: true,
  },
  {
    id: 5,
    title: "Completed",
    color: "#83D17A",
    add: false,
  },
];

export const sprintTitle = [
  {
    id: 1,
    title: "Open",
    color: "#C85E68",
    add: false,
  },
  {
    id: 2,
    title: "In Progress",
    color: "#EDAE01",
    add: false,
  },
  {
    id: 3,
    title: "Overdue",
    color: "#BB0000",
    add: false,
  },
  {
    id: 4,
    title: "On Hold",
    color: "#027A94",
    add: false,
  },
];

export const tasks = [
  {
    id: "P1-T1",
    title: "Task 1",
    milestone: "Milestone 1",
    assignee: "Abdul Ghaffar",
    time: "30 m : 00",
    subtasks: [
      {
        id: "P1-T2",
        title: "Subtask 1",
        assignee: "Duhita Raut",
        date: "30 Nov",
      },
      {
        id: "P1-T3",
        title: "Subtask 2",
        assignee: "John Doe",
        date: "30 Nov",
      },
    ],
    status: "Overdue",
    dependsOn: [], // No dependencies, can start immediately
  },
  {
    id: "P1-T4",
    title: "Task 2",
    milestone: "Milestone 2",
    assignee: "Jane Smith",
    time: "45 m : 00",
    subtasks: [
      {
        id: "P1-T5",
        title: "Subtask 3",
        assignee: "Alice Brown",
        date: "30 Nov",
      },
    ],
    status: "Overdue",
    dependsOn: ["P1-T1"], // Depends on Task 1
  },
  {
    id: "P2-T1",
    title: "Task 3",
    milestone: "Milestone 3",
    assignee: "Bob Wilson",
    time: "1 h : 00",
    subtasks: [
      {
        id: "P2-T2",
        title: "Subtask 4",
        assignee: "Emma Davis",
        date: "30 Nov",
      },
    ],
    status: "Open",
    dependsOn: ["P1-T4"], // Depends on Task 2
  },
  {
    id: "P9-T1",
    title: "Task 5",
    milestone: "Milestone 3",
    assignee: "Bob Wilson",
    time: "1 h : 00",
    subtasks: [
      {
        id: "P5-T2",
        title: "Subtask 4",
        assignee: "Emma Davis",
        date: "30 Nov",
      },
    ],
    status: "In Progress",
    dependsOn: ["P2-T1", "P1-T1"], // Depends on Task 3 and Task 1
  },
  {
    id: "P8-T1",
    title: "Task 4",
    milestone: "Milestone 4 asfalt",
    assignee: "Sarah Johnson",
    time: "2 h : 00",
    subtasks: [
      {
        id: "P1-T5",
        title: "Subtask 3",
        assignee: "Alice Brown",
        date: "30 Nov",
      },
      {
        id: "P1-T9",
        title: "Subtask 3",
        assignee: "Alice Brown",
        date: "30 Nov",
      },
    ],
    status: "On Hold",
    dependsOn: ["P9-T1"], // Depends on Task 5
  },
  {
    id: "P7-T1",
    title: "Task 4",
    milestone: "Milestone 4 asfalt",
    assignee: "Sarah Johnson",
    time: "2 h : 00",
    subtasks: [
      {
        id: "P1-T7",
        title: "Subtask 3",
        assignee: "Alice Brown",
        date: "30 Nov",
      },
      {
        id: "P1-T6",
        title: "Subtask 3",
        assignee: "Alice Brown",
        date: "30 Nov",
      },
    ],
    status: "On Hold",
    dependsOn: ["P8-T1"], // Depends on Task 4 (P8-T1)
  },
  {
    id: "P5-T1",
    title: "Task 5",
    milestone: "Milestone 5",
    assignee: "Michael Brown",
    time: "1 h : 30",
    subtasks: [],
    status: "Completed",
    dependsOn: ["P7-T1", "P9-T1"], // Depends on Task 4 (P7-T1) and Task 5 (P9-T1)
  },
];

export const projects = [
  {
    id: "P1-01",
    title: "Project 1",
    status: "Overdue",
    duration: {
      days: 91,
      hours: 2160,
      minutes: 0,
    },
    client: "Client",
    manager: "Sohail Ansari",
    startDate: "2025-01-01",
    endDate: "2025-04-01",
    milestones: {
      completed: 2,
      total: 2,
      progress: 100,
    },
    tasks: {
      completed: 0,
      total: 0,
      progress: 0,
    },
    issues: {
      resolved: 0,
      total: 0,
      progress: 0,
    },
    members: [
      { initials: "S", color: "#F9D875" },
      { initials: "AC", color: "#FFCEAE" },
      { initials: "B", color: "#A6E6A6" },
      { initials: "N", color: "#AEE6FF" },
      { initials: "K", color: "#C4A9F9" },
      { initials: "D", color: "#FFB8E1" },
      { initials: "CB", color: "#F7A9A8" },
    ],
  },
  {
    id: "P1-02",
    title: "Project 1",
    status: "Overdue",
    duration: {
      days: 91,
      hours: 2160,
      minutes: 0,
    },
    client: "Client",
    manager: "Sohail Ansari",
    startDate: "2025-01-01",
    endDate: "2025-04-01",
    milestones: {
      completed: 1,
      total: 2,
      progress: 50,
    },
    tasks: {
      completed: 5,
      total: 5,
      progress: 100,
    },
    issues: {
      resolved: 1,
      total: 4,
      progress: 25,
    },
    members: [
      { initials: "S", color: "#F9D875" },
      { initials: "AC", color: "#FFCEAE" },
      { initials: "B", color: "#A6E6A6" },
      { initials: "N", color: "#AEE6FF" },
      { initials: "K", color: "#C4A9F9" },
      { initials: "D", color: "#FFB8E1" },
      { initials: "CB", color: "#F7A9A8" },
    ],
  },
  {
    id: "P2-01",
    title: "Project 2",
    status: "Open",
    duration: {
      days: 30,
      hours: 720,
      minutes: 0,
    },
    client: "Internal",
    manager: "Aarav Singh",
    startDate: "2025-03-01",
    endDate: "2025-03-31",
    milestones: {
      completed: 1,
      total: 3,
      progress: 33,
    },
    tasks: {
      completed: 2,
      total: 5,
      progress: 40,
    },
    issues: {
      resolved: 0,
      total: 1,
      progress: 0,
    },
    members: [
      { initials: "AS", color: "#FFCEAE" },
      { initials: "MB", color: "#A6E6A6" },
      { initials: "EK", color: "#AEE6FF" },
    ],
  },
  // {
  //     id: "P3-01",
  //     title: "Project 3",
  //     status: "In Progress",
  //     duration: {
  //         days: 60,
  //         hours: 1440,
  //         minutes: 0,
  //     },
  //     client: "Startup X",
  //     manager: "Neha Patel",
  //     startDate: "2025-02-15",
  //     endDate: "2025-04-15",
  //     milestones: {
  //         completed: 2,
  //         total: 4,
  //         progress: 50,
  //     },
  //     tasks: {
  //         completed: 3,
  //         total: 6,
  //         progress: 50,
  //     },
  //     issues: {
  //         resolved: 1,
  //         total: 2,
  //         progress: 50,
  //     },
  //     members: [
  //         { initials: "NP", color: "#C4A9F9" },
  //         { initials: "JD", color: "#F7A9A8" },
  //     ],
  // },
  {
    id: "P4-01",
    title: "Project 4",
    status: "On Hold",
    duration: {
      days: 45,
      hours: 1080,
      minutes: 0,
    },
    client: "Gov Contract",
    manager: "Raj Malhotra",
    startDate: "2025-01-10",
    endDate: "2025-02-24",
    milestones: {
      completed: 1,
      total: 2,
      progress: 50,
    },
    tasks: {
      completed: 1,
      total: 3,
      progress: 33,
    },
    issues: {
      resolved: 0,
      total: 0,
      progress: 0,
    },
    members: [
      { initials: "RM", color: "#F9D875" },
      { initials: "TS", color: "#AEE6FF" },
    ],
  },
  {
    id: "P5-01",
    title: "Project 5",
    status: "Completed",
    duration: {
      days: 25,
      hours: 600,
      minutes: 0,
    },
    client: "Enterprise Y",
    manager: "Michael Brown",
    startDate: "2024-12-01",
    endDate: "2024-12-26",
    milestones: {
      completed: 2,
      total: 2,
      progress: 100,
    },
    tasks: {
      completed: 4,
      total: 4,
      progress: 100,
    },
    issues: {
      resolved: 2,
      total: 2,
      progress: 100,
    },
    members: [
      { initials: "MB", color: "#83D17A" },
      { initials: "AB", color: "#C4A9F9" },
    ],
  },
];

export const dependancyData = [
  {
    id: "P1-T1",
    title: "Share a presentation of inspirations",
    milestone: "Stakeholders Interviews, Research, Inspira",
    assignee: "Michael Brown",
    time: "1 h : 30",
    section: "List of Tasks",
  },
  {
    id: "P2-T1",
    title: "Share a presentation of inspirations",
    milestone: "Stakeholders Interviews, Research, Inspira",
    assignee: "Michael Brown",
    time: "1 h : 30",
    section: "Main Task",
  },
  {
    id: "P3-T1",
    title: "Share a presentation of inspirations",
    milestone: "Stakeholders Interviews, Research, Inspira",
    assignee: "Michael Brown",
    time: "1 h : 30",
    section: "Successor",
  },
  {
    id: "P4-T1",
    title: "Share a presentation of inspirations",
    milestone: "Stakeholders Interviews, Research, Inspira",
    assignee: "Michael Brown",
    time: "1 h : 30",
    section: "Predecessor",
  },
];
