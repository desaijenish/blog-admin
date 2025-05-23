import type { Icon } from "@phosphor-icons/react/dist/lib/types";
import { ChartPie as ChartPieIcon } from "@phosphor-icons/react/dist/ssr/ChartPie";
import { Ranking } from "@phosphor-icons/react/dist/ssr/Ranking";
import { User as UserIcon } from "@phosphor-icons/react/dist/ssr/User";
import { Users as UsersIcon } from "@phosphor-icons/react/dist/ssr/Users";
import { Clipboard } from "@phosphor-icons/react/dist/ssr/Clipboard";
import { Calendar as CalendarIcon } from "@phosphor-icons/react/dist/ssr/Calendar";
import { Briefcase as BriefcaseIcon } from "@phosphor-icons/react/dist/ssr/Briefcase";
import { Lock as LockIcon } from "@phosphor-icons/react/dist/ssr/Lock";
import { UserCheck as UserCheckIcon } from "@phosphor-icons/react/dist/ssr/UserCheck";
import { Folder as FolderIcon } from "@phosphor-icons/react/dist/ssr/Folder";
import { Bell as BellIcon } from "@phosphor-icons/react/dist/ssr/Bell";
import { Link as LinkIcon } from "@phosphor-icons/react/dist/ssr/Link";
import { Airplane as AirplaneIcon } from "@phosphor-icons/react/dist/ssr/Airplane";
import { UserCircleGear } from "@phosphor-icons/react/dist/ssr/UserCircleGear";
import { TreeStructure } from "@phosphor-icons/react/dist/ssr/TreeStructure";
import { Upload } from "@phosphor-icons/react/dist/ssr/Upload";
import { UsersThree } from "@phosphor-icons/react/dist/ssr/UsersThree";
import { MessengerLogo } from "@phosphor-icons/react/dist/ssr/MessengerLogo";

import { Binary } from "@phosphor-icons/react/dist/ssr/Binary";
import { UserGear } from "@phosphor-icons/react/dist/ssr/UserGear";
import { Article } from "@phosphor-icons/react/dist/ssr/Article";
import { AddressBookTabs } from "@phosphor-icons/react/dist/ssr/AddressBookTabs";
import { HandGrabbing } from "@phosphor-icons/react/dist/ssr/HandGrabbing";
import { Kanban } from "@phosphor-icons/react/dist/ssr/Kanban";
import { AirplaneInFlight } from "@phosphor-icons/react/dist/ssr/AirplaneInFlight";
import { FalloutShelter } from "@phosphor-icons/react/dist/ssr/FalloutShelter";



export const navIcons = {
  Dashboard: ChartPieIcon,
  Candidates: UsersIcon,
  Lead: Ranking,
  Task: Clipboard,
  "Lead Source": LinkIcon,
  User: UserIcon,
  "Time Table": CalendarIcon,
  Leave: AirplaneIcon,
  "Next Follow-up": BellIcon,
  Admin: UserCircleGear,
  Roles: UserCheckIcon,
  Permissions: LockIcon,
  Client: BriefcaseIcon,
  Holiday: CalendarIcon,
  Project: FolderIcon,
  user: UserIcon,
  users: UsersIcon,
  "Work Flow": TreeStructure,
  Post: Upload,
  Chat: MessengerLogo,
  Group: UsersThree,
  content: Binary,
  roles: AddressBookTabs,
  permission: Article,
  client: UserGear,
  holiday: HandGrabbing,
  project: Kanban,
  "Lead Report": AirplaneInFlight,
  "followup period":FalloutShelter
} as Record<string, Icon>;
