"use client";

import { CiFileOn } from "react-icons/ci";
import { BsCloudCheck, BsCloudSlash } from "react-icons/bs";
import { useFilePicker } from "use-file-picker";
import { useMutationState } from "@tanstack/react-query";
import {
  ChevronDown,
  Download,
  Loader,
  MousePointerClick,
  Redo2,
  Undo2
} from "lucide-react";

import { UserButton } from "@/features/auth/components/user-button";
import { ActiveTool, Editor } from "@/features/editor/types";
import { Logo } from "@/features/editor/components/logo";

import { cn } from "@/lib/utils";
import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AdminSvgUploadButton } from "./svg-upload-button";
import { usePaywall } from "@/features/subscriptions/hooks/use-paywall";

interface LogoNavbarProps {
  id: string;
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
  onSaveTemplate?: () => void;
};

export const LogoNavbar = ({
  id,
  editor,
  activeTool,
  onChangeActiveTool,
  onSaveTemplate
}: LogoNavbarProps) => {
  const { shouldBlock, triggerPaywall, isLoading: isLoadingPaywall } = usePaywall();

  const data = useMutationState({
    filters: {
      mutationKey: ["project", { id }],
    },
    select: (mutation) => mutation.state.status,
  });

  const lastStatus = data[data.length - 1];
  const IsMobile = window.innerWidth < 640;

  const isError = lastStatus === "error";
  const isPending = lastStatus === "pending";

  const { openFilePicker } = useFilePicker({
    accept: ".json",
    onFilesSuccessfullySelected: ({ plainFiles }: any) => {
      if (plainFiles.length > 0) {
        const file = plainFiles[0];
        const reader = new FileReader();
        reader.onload = (e) => {
          editor?.loadJson(e.target?.result as string);
        };
        reader.readAsText(file);
      }
    },
  });

  return (
    <nav className="w-full flex items-center p-4 h-[68px] gap-x-8 border-b border-white/10 bg-black text-white lg:pl-[34px]">
      <Logo />
      <div className="w-full flex items-center gap-x-1 h-full">


        <Separator orientation="vertical" className="mx-2 bg-white/10" />

        <Hint label="Select" side="bottom" sideOffset={10}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onChangeActiveTool("select")}
            className={cn("text-white hover:bg-white/10", activeTool === "select" && "bg-white/10")}
          >
            <MousePointerClick className="size-4" />
          </Button>
        </Hint>

        <Hint label="Undo" side="bottom" sideOffset={10}>
          <Button
            disabled={!editor?.canUndo()}
            variant="ghost"
            size="icon"
            onClick={() => editor?.onUndo()}
            className="text-white hover:bg-white/10 disabled:opacity-30"
          >
            <Undo2 className="size-4" />
          </Button>
        </Hint>

        <Hint label="Redo" side="bottom" sideOffset={10}>
          <Button
            disabled={!editor?.canRedo()}
            variant="ghost"
            size="icon"
            onClick={() => editor?.onRedo()}
            className="text-white hover:bg-white/10 disabled:opacity-30"
          >
            <Redo2 className="size-4" />
          </Button>
        </Hint>

        <Separator orientation="vertical" className="mx-2 bg-white/10" />

        {isPending && (
          <div className="flex items-center gap-x-2">
            <Loader className="size-4 animate-spin text-slate-400" />
            <p className="text-xs text-slate-400">Saving...</p>
          </div>
        )}
        {!isPending && isError && (
          <div className="flex items-center gap-x-2">
            <BsCloudSlash className="size-4 text-rose-500" />
            <p className="text-xs text-slate-400">Failed to save</p>
          </div>
        )}
        {!isPending && !isError && (
          <div className="flex items-center gap-x-2">
            <BsCloudCheck className="size-4 text-emerald-500" />
            <p className="text-xs text-slate-400">Saved</p>
          </div>
        )}

        <div className="ml-auto flex items-center gap-x-4">

          {shouldBlock ? (
            <Button
              size="sm"
              variant="default"
              onClick={triggerPaywall}
              disabled={isLoadingPaywall}
              className="bg-brand-primary hover:bg-brand-light text-white font-bold"
            >{IsMobile ? "" : "Download"}<Download className={"size-4 " + (IsMobile ? "ml-0" : "ml-2")} />
            </Button>
          ) : (
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="ghost" className="text-white hover:bg-white/10">
                  Export
                  <Download className="size-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-60 bg-[#1a1a1a] border-white/10 text-white">
                <DropdownMenuItem
                  className="flex items-center gap-x-2 focus:bg-white/10 focus:text-white cursor-pointer"
                  onClick={() => editor?.saveJson()}
                >
                  <CiFileOn className="size-8 text-brand-light" />
                  <div>
                    <p className="font-bold">JSON</p>
                    <p className="text-xs text-slate-400">Save for later editing</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex items-center gap-x-2 focus:bg-white/10 focus:text-white cursor-pointer"
                  onClick={() => editor?.savePng()}
                >
                  <CiFileOn className="size-8 text-brand-light" />
                  <div>
                    <p className="font-bold">PNG</p>
                    <p className="text-xs text-slate-400">Best for sharing on the web</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex items-center gap-x-2 focus:bg-white/10 focus:text-white cursor-pointer"
                  onClick={() => editor?.saveJpg()}
                >
                  <CiFileOn className="size-8 text-brand-light" />
                  <div>
                    <p className="font-bold">JPG</p>
                    <p className="text-xs text-slate-400">Best for printing</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex items-center gap-x-2 focus:bg-white/10 focus:text-white cursor-pointer"
                  onClick={() => editor?.saveSvg()}
                >
                  <CiFileOn className="size-8 text-brand-light" />
                  <div>
                    <p className="font-bold">SVG</p>
                    <p className="text-xs text-slate-400">Best for vector editing</p>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <UserButton />
        </div>
      </div>
    </nav>
  );
};