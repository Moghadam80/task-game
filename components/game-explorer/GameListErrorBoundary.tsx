"use client";

import { Component, type ReactNode } from "react";

type Props = { readonly children: ReactNode };
type State = { readonly hasError: boolean };

export class GameListErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  private retry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div role="alert" className="rounded-3xl border border-red-200 bg-red-50 px-6 py-14 text-center dark:border-red-900/60 dark:bg-red-950/30">
        <h2 className="text-lg font-bold text-red-900 dark:text-red-200">نمایش بازی‌ها با مشکل روبه‌رو شد</h2>
        <p className="mt-2 text-sm text-red-700 dark:text-red-300">می‌توانید دوباره تلاش کنید؛ وضعیت فیلترهای شما حفظ می‌شود.</p>
        <button type="button" onClick={this.retry} className="mt-5 rounded-xl bg-red-700 px-5 py-2.5 text-sm font-bold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-red-950">تلاش دوباره</button>
      </div>
    );
  }
}
