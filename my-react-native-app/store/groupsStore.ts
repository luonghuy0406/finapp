import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Group } from '@/types';

interface GroupsState {
  groups: Group[];
  isLoading: boolean;
  error: string | null;
  addGroup: (group: Omit<Group, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateGroup: (id: string, groupData: Partial<Group>) => void;
  deleteGroup: (id: string) => void;
  getGroupById: (id: string) => Group | undefined;
  addMemberToGroup: (groupId: string, userId: string, role: 'owner' | 'admin' | 'member' | 'viewer') => void;
  removeMemberFromGroup: (groupId: string, userId: string) => void;
  updateMemberRole: (groupId: string, userId: string, role: 'owner' | 'admin' | 'member' | 'viewer') => void;
  clearError: () => void;
}

export const useGroupsStore = create<GroupsState>()(
  persist(
    (set, get) => ({
      groups: [
        {
          id: '1',
          name: 'Family Budget',
          description: 'Shared expenses for our family',
          members: [
            { userId: '1', role: 'owner' },
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      isLoading: false,
      error: null,
      
      addGroup: (groupData) => {
        const newGroup: Group = {
          ...groupData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        set(state => ({
          groups: [...state.groups, newGroup]
        }));
      },
      
      updateGroup: (id, groupData) => {
        set(state => ({
          groups: state.groups.map(group => 
            group.id === id 
              ? { 
                  ...group, 
                  ...groupData, 
                  updatedAt: new Date().toISOString() 
                } 
              : group
          )
        }));
      },
      
      deleteGroup: (id) => {
        set(state => ({
          groups: state.groups.filter(group => group.id !== id)