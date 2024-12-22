exports.LoginPage = class LoginPage {

    constructor(page) {
        this.page = page;
        this.username_field = page.getByPlaceholder('Enter your username or email');
        this.password_field = page.getByPlaceholder('Enter your password');
        this.login_btn = page.getByRole('button', { name: 'Log in' });
    }

    async gotoLoginPage() {
        await this.page.goto("https://www.wowvegas.com/login");
    }
    async login(username, password) {
        await this.username_field.fill(username);
        await this.password_field.fill(password);
        await this.login_btn.click();
    }
}