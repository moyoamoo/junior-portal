
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Shared mock for Supabase client creation
const { createClientMock } = vi.hoisted(() => ({
    createClientMock: vi.fn()
}));

vi.mock('@supabase/supabase-js', () => ({
    createClient: createClientMock
}));

vi.mock('$env/static/public', () => ({
    PUBLIC_SUPABASE_URL: 'https://test.supabase.co',
    PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'test-key'
}));

vi.mock('$env/static/private', () => ({
    SUPABASE_SERVICE_ROLE_KEY: 'service-key'
}));

vi.mock('$lib/server/adminMode', () => ({
    ADMIN_MODE_DURATION: 3600
}));

vi.mock('@sveltejs/kit', () => ({
    fail: vi.fn((status, data) => ({
        status,
        data
    })),
    redirect: vi.fn((status, location) => {
        throw Object.assign(new Error('Redirect'), {
            status,
            location
        });
    })
}));

import { actions } from '../../src/routes/admin-mode/+page.server.js';

describe('Admin Mode', () => {

    /** @type {any} */
    let locals;

    /** @type {any} */
    let cookies;

    /** @type {any} */
    let request;

    const normalUser = {
        id: 'normal-user-123'
    };

    const adminUser = {
        id: 'admin-user-456'
    };

    // Create a mock request with form data
    /** @param {Record<string, string>} [fields] */
    const createRequest = (fields = {}) => ({
        formData: async () => {
            const formData = new FormData();

            Object.entries(fields).forEach(([key, value]) => {
                formData.set(key, value);
            });

            return formData;
        }
    });

    // Create a mock SvelteKit event
    /** @returns {any} */
    const getEvent = () => ({
        request,
        locals,
        cookies
    });

    beforeEach(() => {
        vi.clearAllMocks();

        locals = {
            getUser: vi.fn().mockResolvedValue(normalUser)
        };

        cookies = {
            get: vi.fn(),
            set: vi.fn(),
            delete: vi.fn()
        };

        request = createRequest({
            email: 'admin@test.com',
            password: 'password123',
            returnTo: '/juniors'
        });
    });

    describe('login', () => {

        it('should reject users who are not logged in', async () => {

            locals.getUser.mockResolvedValue(null);

            const result = /** @type {{ status: number, data: { message: string } }} */ (
                await actions.login(getEvent())
            );

            expect(result.status).toBe(401);
            expect(result.data.message).toBe(
                'You must be logged in to use Admin Mode.'
            );

            expect(createClientMock).not.toHaveBeenCalled();
        });

        it('should reject missing email or password', async () => {

            request = createRequest({
                email: '',
                password: ''
            });

            const result = /** @type {{ status: number, data: { message: string } }} */ (
                await actions.login(getEvent())
            );

            expect(result.status).toBe(400);
            expect(result.data.message).toBe(
                'Please enter an email and password.'
            );

            expect(createClientMock).not.toHaveBeenCalled();
        });

        it('should reject invalid Admin Mode credentials', async () => {

            const authClient = {
                auth: {
                    signInWithPassword: vi.fn().mockResolvedValue({
                        data: { user: null },
                        error: { message: 'Invalid login credentials' }
                    })
                }
            };

            createClientMock.mockReturnValueOnce(authClient);

            const result = /** @type {{ status: number, data: { message: string } }} */ (
                await actions.login(getEvent())
            );

            expect(result.status).toBe(401);
            expect(result.data.message).toBe(
                'Invalid login credentials'
            );

            expect(authClient.auth.signInWithPassword)
                .toHaveBeenCalledWith({
                    email: 'admin@test.com',
                    password: 'password123'
                });
        });

        it('should reject accounts without the admin_mode role', async () => {

            const authClient = {
                auth: {
                    signInWithPassword: vi.fn().mockResolvedValue({
                        data: { user: adminUser },
                        error: null
                    })
                }
            };

            const profileQuery = {
                select: vi.fn().mockReturnThis(),
                eq: vi.fn().mockReturnThis(),
                single: vi.fn().mockResolvedValue({
                    data: {
                        id: adminUser.id,
                        role: 'user'
                    },
                    error: null
                })
            };

            const adminClient = {
                from: vi.fn().mockReturnValue(profileQuery)
            };

            createClientMock
                .mockReturnValueOnce(authClient)
                .mockReturnValueOnce(adminClient);

            const result = /** @type {{ status: number, data: { message: string } }} */ (
                await actions.login(getEvent())
            );

            expect(result.status).toBe(403);
            expect(result.data.message).toBe(
                'This account does not have Admin Mode access.'
            );

            expect(adminClient.from).toHaveBeenCalledWith('profiles');
            expect(cookies.set).not.toHaveBeenCalled();
        });

        it('should successfully enable Admin Mode', async () => {

            const authClient = {
                auth: {
                    signInWithPassword: vi.fn().mockResolvedValue({
                        data: { user: adminUser },
                        error: null
                    })
                }
            };

            const profileQuery = {
                select: vi.fn().mockReturnThis(),
                eq: vi.fn().mockReturnThis(),
                single: vi.fn().mockResolvedValue({
                    data: {
                        id: adminUser.id,
                        role: 'admin_mode'
                    },
                    error: null
                })
            };

            const sessionQuery = {
                insert: vi.fn().mockReturnThis(),
                select: vi.fn().mockReturnThis(),
                single: vi.fn().mockResolvedValue({
                    data: {
                        id: 'session-123',
                        expires_at: '2026-11-06T18:00:00.000Z'
                    },
                    error: null
                })
            };

            const adminClient = {
                from: vi.fn((table) => {
                    if (table === 'profiles') {
                        return profileQuery;
                    }

                    if (table === 'admin_mode_sessions') {
                        return sessionQuery;
                    }
                })
            };

            createClientMock
                .mockReturnValueOnce(authClient)
                .mockReturnValueOnce(adminClient);

            await expect(
                actions.login(getEvent())
            ).rejects.toMatchObject({
                status: 303,
                location: '/juniors'
            });

            expect(sessionQuery.insert).toHaveBeenCalledWith(
                expect.objectContaining({
                    user_id: normalUser.id,
                    admin_user_id: adminUser.id
                })
            );

            expect(cookies.set).toHaveBeenCalledWith(
                'admin_mode_session',
                'session-123',
                expect.objectContaining({
                    path: '/',
                    httpOnly: true,
                    secure: true,
                    sameSite: 'strict',
                    maxAge: 3600
                })
            );
        });

        it('should use the default redirect for an unsafe return path', async () => {

            const authClient = {
                auth: {
                    signInWithPassword: vi.fn().mockResolvedValue({
                        data: { user: adminUser },
                        error: null
                    })
                }
            };

            const profileQuery = {
                select: vi.fn().mockReturnThis(),
                eq: vi.fn().mockReturnThis(),
                single: vi.fn().mockResolvedValue({
                    data: { role: 'admin_mode' },
                    error: null
                })
            };

            const sessionQuery = {
                insert: vi.fn().mockReturnThis(),
                select: vi.fn().mockReturnThis(),
                single: vi.fn().mockResolvedValue({
                    data: { id: 'session-123' },
                    error: null
                })
            };

            const adminClient = {
                from: vi.fn((table) =>
                    table === 'profiles'
                        ? profileQuery
                        : sessionQuery
                )
            };

            createClientMock
                .mockReturnValueOnce(authClient)
                .mockReturnValueOnce(adminClient);

            request = createRequest({
                email: 'admin@test.com',
                password: 'password123',
                returnTo: '//malicious-site.com'
            });

            await expect(
                actions.login(getEvent())
            ).rejects.toMatchObject({
                status: 303,
                location: '/juniors'
            });
        });
    });

    describe('logout', () => {

        it('should redirect to login if the normal user is not logged in', async () => {

            locals.getUser.mockResolvedValue(null);

            await expect(
                actions.logout(getEvent())
            ).rejects.toMatchObject({
                status: 303,
                location: '/'
            });

            expect(cookies.delete).not.toHaveBeenCalled();
            expect(createClientMock).not.toHaveBeenCalled();
        });

        it('should successfully disable Admin Mode', async () => {

            cookies.get.mockReturnValue('session-123');

            const deleteQuery = {
                delete: vi.fn().mockReturnThis(),
                eq: vi.fn().mockReturnThis()
            };

            const adminClient = {
                from: vi.fn().mockReturnValue(deleteQuery)
            };

            createClientMock.mockReturnValueOnce(adminClient);

            await expect(
                actions.logout(getEvent())
            ).rejects.toMatchObject({
                status: 303,
                location: '/juniors'
            });

            expect(adminClient.from).toHaveBeenCalledWith(
                'admin_mode_sessions'
            );

            expect(deleteQuery.delete).toHaveBeenCalled();

            expect(deleteQuery.eq).toHaveBeenNthCalledWith(
                1,
                'id',
                'session-123'
            );

            expect(deleteQuery.eq).toHaveBeenNthCalledWith(
                2,
                'user_id',
                normalUser.id
            );

            expect(cookies.delete).toHaveBeenCalledWith(
                'admin_mode_session',
                { path: '/' }
            );
        });

        it('should delete the cookie even when no Admin Mode session exists', async () => {

            cookies.get.mockReturnValue(undefined);

            await expect(
                actions.logout(getEvent())
            ).rejects.toMatchObject({
                status: 303,
                location: '/juniors'
            });

            expect(createClientMock).not.toHaveBeenCalled();

            expect(cookies.delete).toHaveBeenCalledWith(
                'admin_mode_session',
                { path: '/' }
            );
        });
    });
});
