export function Footer() {
  return (
    <footer className="border-t bg-background mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-2xl bg-[#10B981] flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <div>
              <p className="font-semibold text-[#10B981]">SOM</p>
              <p className="text-sm text-muted-foreground">Super Office Management</p>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            © 2026 Super Office Management. All rights reserved.
          </p>

          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-[#10B981] transition-colors">Privacy</a>
            <a href="#" className="hover:text-[#10B981] transition-colors">Terms</a>
            <a href="#" className="hover:text-[#10B981] transition-colors">Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
}