// Password Gate System
// Checks if user has access, if not shows password prompt

(function() {
    const CORRECT_PASSWORD = 'Dufala';
    const COOKIE_NAME = 'dex_access';
    const COOKIE_DAYS = 365; // Cookie lasts 1 year

    // Check if access cookie exists
    function hasAccess() {
        return document.cookie.split(';').some(c => c.trim().startsWith(COOKIE_NAME + '='));
    }

    // Set access cookie
    function grantAccess() {
        const expires = new Date();
        expires.setTime(expires.getTime() + (COOKIE_DAYS * 24 * 60 * 60 * 1000));
        document.cookie = `${COOKIE_NAME}=granted; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
    }

    // If already has access, do nothing
    if (hasAccess()) {
        return;
    }

    // Create and inject the gate overlay
    function createGate() {
        // Prevent scrolling on body
        document.body.style.overflow = 'hidden';

        const overlay = document.createElement('div');
        overlay.id = 'password-gate';
        overlay.innerHTML = `
            <style>
                #password-gate {
                    position: fixed;
                    inset: 0;
                    background: linear-gradient(135deg, #0a0a14 0%, #1a1a2e 50%, #0f0f1a 100%);
                    z-index: 999999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-family: 'Ubuntu', 'Segoe UI', sans-serif;
                }
                #password-gate * {
                    box-sizing: border-box;
                }
                .gate-container {
                    text-align: center;
                    padding: 48px;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 24px;
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    box-shadow: 0 25px 80px rgba(0, 0, 0, 0.5);
                    max-width: 400px;
                    width: 90%;
                    animation: gateIn 0.5s cubic-bezier(0.22, 1, 0.36, 1);
                }
                @keyframes gateIn {
                    from {
                        opacity: 0;
                        transform: scale(0.9) translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }
                .gate-title {
                    color: #fff;
                    font-size: 42px;
                    font-weight: 700;
                    margin: 0 0 8px 0;
                    letter-spacing: 2px;
                    text-shadow: 0 0 30px rgba(255,255,255,0.3);
                }
                .gate-subtitle {
                    color: rgba(255, 255, 255, 0.6);
                    font-size: 14px;
                    margin: 0 0 32px 0;
                    letter-spacing: 1px;
                }
                .gate-input {
                    width: 100%;
                    padding: 16px 24px;
                    font-size: 18px;
                    font-family: inherit;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.15);
                    border-radius: 50px;
                    color: #fff;
                    text-align: center;
                    outline: none;
                    transition: all 0.3s ease;
                }
                .gate-input::placeholder {
                    color: rgba(255, 255, 255, 0.4);
                }
                .gate-input:focus {
                    border-color: rgba(255, 255, 255, 0.35);
                    box-shadow: 0 0 30px rgba(255, 255, 255, 0.1);
                }
                .gate-input.error {
                    border-color: #ff4757;
                    animation: shake 0.5s ease;
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    20%, 60% { transform: translateX(-10px); }
                    40%, 80% { transform: translateX(10px); }
                }
                .gate-button {
                    width: 100%;
                    padding: 16px 24px;
                    font-size: 16px;
                    font-family: inherit;
                    font-weight: 600;
                    letter-spacing: 1px;
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 50px;
                    color: #fff;
                    cursor: pointer;
                    margin-top: 16px;
                    transition: all 0.3s ease;
                }
                .gate-button:hover {
                    background: rgba(255, 255, 255, 0.18);
                    border-color: rgba(255, 255, 255, 0.35);
                    transform: translateY(-2px);
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                }
                .gate-error {
                    color: #ff4757;
                    font-size: 14px;
                    margin-top: 16px;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }
                .gate-error.visible {
                    opacity: 1;
                }
            </style>
            <div class="gate-container">
                <h1 class="gate-title">dex</h1>
                <p class="gate-subtitle">enter password to continue</p>
                <input type="password" class="gate-input" id="gate-password" placeholder="password" autocomplete="off">
                <button class="gate-button" id="gate-submit">enter</button>
                <p class="gate-error" id="gate-error">incorrect password</p>
            </div>
        `;

        document.body.appendChild(overlay);

        // Get elements
        const input = document.getElementById('gate-password');
        const button = document.getElementById('gate-submit');
        const error = document.getElementById('gate-error');

        // Focus input
        setTimeout(() => input.focus(), 100);

        // Check password
        function checkPassword() {
            const entered = input.value;
            
            if (entered === CORRECT_PASSWORD) {
                grantAccess();
                overlay.style.opacity = '0';
                overlay.style.transition = 'opacity 0.3s ease';
                setTimeout(() => {
                    overlay.remove();
                    document.body.style.overflow = '';
                }, 300);
            } else {
                input.classList.add('error');
                error.classList.add('visible');
                input.value = '';
                setTimeout(() => {
                    input.classList.remove('error');
                }, 500);
            }
        }

        // Event listeners
        button.addEventListener('click', checkPassword);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                checkPassword();
            }
        });
        input.addEventListener('input', () => {
            error.classList.remove('visible');
        });
    }

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createGate);
    } else {
        createGate();
    }
})();
