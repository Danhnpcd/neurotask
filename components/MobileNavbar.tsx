import React from 'react';
import { LayoutGrid, Calendar, Plus, User } from 'lucide-react';

interface MobileNavbarProps {
    activeTab: 'dashboard' | 'calendar' | 'profile';
    onTabChange: (tab: 'dashboard' | 'calendar' | 'profile') => void;
    onAddProjectClick: () => void;
    onResetSelection: () => void;
}

const MobileNavbar: React.FC<MobileNavbarProps> = ({
    activeTab,
    onTabChange,
    onAddProjectClick,
    onResetSelection,
}) => {
    return (
        <div className="fixed bottom-0 left-0 w-full z-50 md:hidden">
            {/* Background with blur effect */}
            <div className="absolute inset-0 bg-bg-card/90 backdrop-blur-md border-t border-white/10" />

            <div className="relative flex items-center justify-between px-6 py-4 pb-safe">
                {/* Dashboard / Home */}
                <button
                    onClick={() => {
                        onResetSelection();
                        onTabChange('dashboard');
                    }}
                    className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'dashboard' ? 'text-primary' : 'text-text-sub hover:text-text-main'
                        }`}
                >
                    <LayoutGrid size={24} />
                    <span className="text-[10px] font-medium">Tổng quan</span>
                </button>

                {/* Calendar */}
                <button
                    onClick={() => onTabChange('calendar')}
                    className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'calendar' ? 'text-primary' : 'text-text-sub hover:text-text-main'
                        }`}
                >
                    <Calendar size={24} />
                    <span className="text-[10px] font-medium">Lịch</span>
                </button>

                {/* Add Project - Floating Center Button */}
                <div className="relative -top-6">
                    <button
                        onClick={onAddProjectClick}
                        className="w-14 h-14 rounded-full bg-primary text-bg-dark flex items-center justify-center shadow-[0_0_20px_rgba(0,224,255,0.4)] border-4 border-bg-dark transform transition-transform active:scale-95"
                    >
                        <Plus size={28} strokeWidth={3} />
                    </button>
                </div>

                {/* Placeholder for spacing (optional if 5 items, but with 4 items + center button, logic is slightly different. 
            The requirement said 4 items: Dashboard, Calendar, Add Project, Profile.
            Usually Add Project is the center one. Let's assume standard layout:
            Left: Dashboard, Calendar
            Center: Add
            Right: Profile
            Wait, the prompt says "Gồm 4 nút chức năng".
            1. Total
            2. Calendar
            3. Add Project (Center)
            4. Profile
            That's 4 items TOTAL, so layout is: Item - Item - Center(Add) - Item? No, that's unbalanced.
            Let's re-read: "Gồm 4 nút chức năng: 1. Overview, 2. Calendar, 3. Add Project, 4. Profile"
            If Add Project is center, we have 3 nav items? 
            "Layout: Flexbox, căn đều các mục (justify-between)"
            If I have 4 items including the center one, simple justify-between might work but the center one needs to be visually distinct.
            Actually, commonly it's 2 on left, 2 on right, plus floating. Or 4 items total where one IS the floating one.
            The list has 4 distinct bullet points.
            1. Overview
            2. Calendar
            3. Add Project (floating center)
            4. Profile
            This is 3 standard nav items + 1 floating action.
            To center the floating action, we might need a dummy spacer or just justify-between.
            With 3 standard items + 1 floating, it's unbalanced (2 left, 1 floating, 1 right).
            Let's try: Overview - Calendar - [Add] - Profile.
            That's 4 items. The 'Add' is the 3rd one. Visual balance might be off.
            Let's stick to simple justify-between for now, but maybe the user meant 5 items?
            No, explicitly 4.
            Let's implement exactly as requested: 4 items, one is the "Add Project" which is "Menu Item 3" positionally but styled floating.
            Actually, if I put "Add Project" in the flow, `justify-between` will place them:
            [Overview] ... [Calendar] ... [Add] ... [Profile]
            That looks okay.
        */}

                {/* Profile */}
                <button
                    onClick={() => onTabChange('profile')}
                    className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'profile' ? 'text-primary' : 'text-text-sub hover:text-text-main'
                        }`}
                >
                    <User size={24} />
                    <span className="text-[10px] font-medium">Cá nhân</span>
                </button>
            </div>
        </div>
    );
};

export default MobileNavbar;
