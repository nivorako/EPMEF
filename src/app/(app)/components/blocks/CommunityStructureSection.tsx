import type { CommunityStructureBlockData } from "./RenderBlocks";

// CommunityStructure — Displays association groups (Pasteur, Bureau, Diacres, Sections).
// Each group shows its members with optional photo and role.

export function CommunityStructureSection({
    data,
}: {
    data: CommunityStructureBlockData;
}) {
    return (
        <section className="py-16 sm:py-20 bg-stone-50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {data.title && (
                    <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-center mb-12">
                        {data.title}
                    </h2>
                )}

                <div className="space-y-14">
                    {data.groups.map((group, gIdx) => (
                        <div key={gIdx}>
                            <h3 className="text-2xl font-bold text-primary mb-2">
                                {group.groupName}
                            </h3>
                            {group.description && (
                                <p className="text-muted mb-6 max-w-2xl">
                                    {group.description}
                                </p>
                            )}

                            {group.members && group.members.length > 0 && (
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {group.members.map((member, mIdx) => (
                                        <div
                                            key={mIdx}
                                            className="flex flex-col items-center text-center"
                                        >
                                            {member.photo?.url ? (
                                                <img
                                                    src={member.photo.url}
                                                    alt={
                                                        member.photo.alt ||
                                                        member.name
                                                    }
                                                    className="w-24 h-24 rounded-full object-cover mb-3 ring-2 ring-accent/30"
                                                />
                                            ) : (
                                                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-3 text-2xl font-bold text-primary">
                                                    {member.name
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </div>
                                            )}
                                            <p className="font-semibold text-sm">
                                                {member.name}
                                            </p>
                                            {member.role && (
                                                <p className="text-xs text-muted">
                                                    {member.role}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
