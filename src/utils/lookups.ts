import type { Project, TeamMember } from '@/types'

export function memberName(members: readonly TeamMember[], id: string): string {
  return members.find((member) => member.id === id)?.name ?? 'Unassigned'
}

export function projectName(projects: readonly Project[], id: string): string {
  return projects.find((project) => project.id === id)?.name ?? 'Unknown project'
}
