
import { describe, it, expect, vi } from 'vitest';
import { login } from '../lib/server/login.js';

describe('Login', () => {

    it('should successfully login with valid credentials', async () => {

        // Mock successful Supabase authentication
        const supabase = {
            auth: {
                signInWithPassword: vi.fn().mockResolvedValue({
                    data: {
                        user: { id: '123' }
                    },
                    error: null
                })
            },

            from: vi.fn().mockReturnValue({
                select: vi.fn().mockReturnValue({
                    eq: vi.fn().mockReturnValue({
                        single: vi.fn().mockResolvedValue({
                            data: { id: '123', email: 'test@example.com' },
                            error: null
                        })
                    })
                })
            })
        };

        const result = await login(
            supabase,
            'test@example.com',
            'password123'
        );

        expect(result.success).toBe(true);

        expect(supabase.auth.signInWithPassword)
            .toHaveBeenCalledWith({
                email: 'test@example.com',
                password: 'password123'
            });
    });


    it('should reject incorrect credentials', async () => {

        const supabase = {
            auth: {
                signInWithPassword: vi.fn().mockResolvedValue({
                    data: { user: null },
                    error: { message: 'Invalid login credentials' }
                })
            },
            from: vi.fn()
        };

        const result = await login(
            supabase,
            'test@example.com',
            'wrongpassword'
        );

        expect(result.success).toBe(false);
        expect(result.message).toBe('Email or password is incorrect');

        // Profile should not be queried if authentication fails
        expect(supabase.from).not.toHaveBeenCalled();
    });


    it('should reject a missing profile', async () => {

        const supabase = {
            auth: {
                signInWithPassword: vi.fn().mockResolvedValue({
                    data: {
                        user: { id: '123' }
                    },
                    error: null
                })
            },

            from: vi.fn().mockReturnValue({
                select: vi.fn().mockReturnValue({
                    eq: vi.fn().mockReturnValue({
                        single: vi.fn().mockResolvedValue({
                            data: null,
                            error: { message: 'Profile not found' }
                        })
                    })
                })
            })
        };

        const result = await login(
            supabase,
            'test@example.com',
            'password123'
        );

        expect(result.success).toBe(false);
        expect(result.message).toBe('Could not load account - try again!');

        // Check profile lookup was attempted
        expect(supabase.from).toHaveBeenCalledWith('profiles');
    });


    it('should handle an unexpected authentication error', async () => {

        const supabase = {
            auth: {
                signInWithPassword: vi.fn().mockRejectedValue(
                    new Error('Network error')
                )
            },
            from: vi.fn()
        };

        await expect(
            login(supabase, 'test@example.com', 'password123')
        ).rejects.toThrow('Network error');

        // Profile should not be queried after an authentication exception
        expect(supabase.from).not.toHaveBeenCalled();
    });

});
