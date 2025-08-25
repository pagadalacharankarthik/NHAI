import { create } from "zustand"
import { persist } from "zustand/middleware"

interface User {
  id: string
  name: string
  role: "admin" | "staff" | "supervisor" | "citizen"
  department?: string
  assignedToilets?: string[]
  assignedArea?: string
  permissions: string[]
}

interface Facility {
  id: string
  name: string
  location: string
  status: "clean" | "dirty" | "locked" | "maintenance"
  lastCleaned: string
  priority: "low" | "normal" | "high"
  assignedStaff?: string
  iotData: {
    odorLevel: number
    waterFlow: boolean
    doorStatus: "open" | "locked" | "maintenance"
    occupancyCount: number
    temperature: number
    humidity: number
    batteryLevel: number
    signalStrength: number
    lastUpdate: string
  }
}

interface FeedbackEntry {
  id: string
  facilityId: string
  facilityName: string
  type: "clean" | "dirty" | "locked"
  rating?: number
  comments?: string
  photos?: string[]
  timestamp: string
  userId?: string
  status: "pending" | "reviewed" | "resolved"
}

interface TaskEntry {
  id: string
  facilityId: string
  staffId: string
  type: "cleaning" | "maintenance" | "inspection"
  status: "pending" | "in_progress" | "completed" | "approved" | "rejected"
  checklist: Array<{
    id: string
    task: string
    completed: boolean
  }>
  photos?: string[]
  notes?: string
  completedAt?: string
  reviewedBy?: string
  reviewNotes?: string
}

interface AppState {
  // Auth
  user: User | null
  isAuthenticated: boolean

  // Data
  facilities: Facility[]
  feedback: FeedbackEntry[]
  tasks: TaskEntry[]

  // UI State
  notifications: Array<{
    id: string
    type: "success" | "error" | "warning" | "info"
    message: string
    timestamp: string
  }>

  // Actions
  login: (role: User["role"], userData: User) => void
  logout: () => void
  updateFacility: (facilityId: string, updates: Partial<Facility>) => void
  submitFeedback: (feedback: Omit<FeedbackEntry, "id" | "timestamp">) => void
  createTask: (task: Omit<TaskEntry, "id">) => void
  updateTask: (taskId: string, updates: Partial<TaskEntry>) => void
  addNotification: (notification: Omit<AppState["notifications"][0], "id" | "timestamp">) => void
  removeNotification: (id: string) => void
  generateMockData: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      facilities: [],
      feedback: [],
      tasks: [],
      notifications: [],

      // Auth actions
      login: (role, userData) => {
        set({ user: userData, isAuthenticated: true })
        get().addNotification({
          type: "success",
          message: `Welcome back, ${userData.name}!`,
        })
      },

      logout: () => {
        set({ user: null, isAuthenticated: false })
        get().addNotification({
          type: "info",
          message: "You have been logged out successfully",
        })
      },

      // Data actions
      updateFacility: (facilityId, updates) => {
        set((state) => ({
          facilities: state.facilities.map((facility) =>
            facility.id === facilityId ? { ...facility, ...updates } : facility,
          ),
        }))
      },

      submitFeedback: (feedbackData) => {
        const newFeedback: FeedbackEntry = {
          ...feedbackData,
          id: `fb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date().toISOString(),
          status: "pending",
        }

        set((state) => ({
          feedback: [newFeedback, ...state.feedback],
        }))

        get().addNotification({
          type: "success",
          message: "Feedback submitted successfully!",
        })
      },

      createTask: (taskData) => {
        const newTask: TaskEntry = {
          ...taskData,
          id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        }

        set((state) => ({
          tasks: [newTask, ...state.tasks],
        }))
      },

      updateTask: (taskId, updates) => {
        set((state) => ({
          tasks: state.tasks.map((task) => (task.id === taskId ? { ...task, ...updates } : task)),
        }))

        if (updates.status === "completed") {
          get().addNotification({
            type: "success",
            message: "Task completed successfully!",
          })
        }
      },

      // Notification actions
      addNotification: (notification) => {
        const newNotification = {
          ...notification,
          id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date().toISOString(),
        }

        set((state) => ({
          notifications: [newNotification, ...state.notifications.slice(0, 4)], // Keep only 5 notifications
        }))

        // Auto-remove after 5 seconds
        setTimeout(() => {
          get().removeNotification(newNotification.id)
        }, 5000)
      },

      removeNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter((notif) => notif.id !== id),
        }))
      },

      // Generate mock data
      generateMockData: () => {
        const mockFacilities: Facility[] = [
          {
            id: "NH1_KM45",
            name: "NH1 KM 45 - Delhi",
            location: "Delhi-Mumbai Highway, KM 45",
            status: "clean",
            lastCleaned: "2 hours ago",
            priority: "normal",
            assignedStaff: "STAFF_001",
            iotData: {
              odorLevel: 25,
              waterFlow: true,
              doorStatus: "open",
              occupancyCount: 45,
              temperature: 28,
              humidity: 65,
              batteryLevel: 85,
              signalStrength: 92,
              lastUpdate: new Date().toISOString(),
            },
          },
          {
            id: "NH1_KM67",
            name: "NH1 KM 67 - Gurgaon",
            location: "Delhi-Mumbai Highway, KM 67",
            status: "clean",
            lastCleaned: "1 hour ago",
            priority: "normal",
            assignedStaff: "STAFF_001",
            iotData: {
              odorLevel: 30,
              waterFlow: true,
              doorStatus: "open",
              occupancyCount: 38,
              temperature: 27,
              humidity: 62,
              batteryLevel: 78,
              signalStrength: 88,
              lastUpdate: new Date().toISOString(),
            },
          },
          {
            id: "NH8_KM23",
            name: "NH8 KM 23 - Jaipur",
            location: "Delhi-Jaipur Highway, KM 23",
            status: "dirty",
            lastCleaned: "6 hours ago",
            priority: "high",
            assignedStaff: "STAFF_002",
            iotData: {
              odorLevel: 75,
              waterFlow: false,
              doorStatus: "open",
              occupancyCount: 62,
              temperature: 32,
              humidity: 58,
              batteryLevel: 45,
              signalStrength: 76,
              lastUpdate: new Date().toISOString(),
            },
          },
        ]

        set({ facilities: mockFacilities })
      },
    }),
    {
      name: "nhai-app-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        facilities: state.facilities,
        feedback: state.feedback,
        tasks: state.tasks,
      }),
    },
  ),
)
