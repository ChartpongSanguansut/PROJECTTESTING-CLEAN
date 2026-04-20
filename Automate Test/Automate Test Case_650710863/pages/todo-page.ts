import { expect, Locator, Page } from "@playwright/test";

export class TodoPage {
  readonly page: Page;
  readonly input: Locator;
  readonly items: Locator;

  constructor(page: Page) {
    this.page = page;
    this.input = page.getByPlaceholder("What needs to be done?");
    this.items = page.locator(".todo-list li");
  }

  async goto() {
    await this.page.goto("https://demo.playwright.dev/todomvc/");
  }

  async addTodo(text: string) {
    await this.input.fill(text);
    await this.input.press("Enter");
  }

  async addTodos(texts: string[]) {
    for (const t of texts) await this.addTodo(t);
  }

  async expectCount(count: number) {
    await expect(this.items).toHaveCount(count);
  }

  async complete(index: number) {
    await this.items.nth(index).locator("input.toggle").check();
  }

  async expectCompleted(index: number) {
    await expect(this.items.nth(index)).toHaveClass(/completed/);
  }

  async delete(index: number) {
    const item = this.items.nth(index);
    await item.hover();
    await item.locator("button.destroy").click();
  }
}