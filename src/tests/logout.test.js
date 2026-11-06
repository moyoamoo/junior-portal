
 // @ts-nocheck

import { describe, it, expect, vi } from 'vitest';
import { load, actions } from '../routes/(app)/logout/+page.server.js';

describe('Logout', () => {

    it('should redirect GET requests to the login page', async () => {

        await expect(load()).rejects.toMatchObject({
            status: 303,
            location: '/'
        });
    });

    it('should successfully log out the user', async () => {

        // Mock Supabase logout
        const signOut = vi.fn().mockResolvedValue({
            error: null
        });

        const locals = {
            getUser: vi.fn(),
            supabase: {
                auth: {
                    signOut
                }
            }
        };

        const cookies = {
            delete: vi.fn()
        };

        // Execute logout action
        await expect(
            actions.default({ locals, cookies })
        ).rejects.toMatchObject({
            status: 303,
            location: '/'
        });

        // Check Supabase logout was called
        expect(signOut).toHaveBeenCalledOnce();
    });

    it('should delete the admin session cookie', async () => {

        const locals = {
            getUser: vi.fn(),
            supabase: {
                auth: {
                    signOut: vi.fn().mockResolvedValue({
                        error: null
                    })
                }
            }
        };

        const cookies = {
            delete: vi.fn()
        };

        // Execute logout action
        await expect(
            actions.default({ locals, cookies })
        ).rejects.toMatchObject({
            status: 303,
            location: '/'
        });

        // Check admin cookie was deleted
        expect(cookies.delete).toHaveBeenCalledWith(
            'admin_mode_session',
            { path: '/' }
        );
    });

});
