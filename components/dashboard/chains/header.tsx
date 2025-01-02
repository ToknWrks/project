import Link from "next/link";

interface ChainsHeaderProps {
  title: string;
}

export function ChainsHeader({ title }: ChainsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold">{title}</h1>
      <Link 
        href="/settings/chains"
        className="text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        Manage Chains
      </Link>
    </div>
  );
}