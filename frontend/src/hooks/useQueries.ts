import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Challenge, MentorResponse } from '../backend';

// ─── Challenges ───────────────────────────────────────────────────────────────

export function useGetAllChallenges() {
  const { actor, isFetching } = useActor();

  return useQuery<Challenge[]>({
    queryKey: ['challenges'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllChallenges();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetChallenge(id: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Challenge>({
    queryKey: ['challenge', id],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not ready');
      return actor.getChallenge(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useAddChallenge() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      description,
      difficulty,
      estimatedTime,
    }: {
      id: string;
      description: string;
      difficulty: bigint;
      estimatedTime: bigint;
    }) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.addChallenge(id, description, difficulty, estimatedTime);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
    },
  });
}

// ─── Mentor Responses ─────────────────────────────────────────────────────────

export function useStoreMentorResponse() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({
      sessionId,
      response,
    }: {
      sessionId: string;
      response: MentorResponse;
    }) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.storeMentorResponse(sessionId, response);
    },
  });
}
