type RegionsData = {
  country: string;
  regions: { name: string; slug: string; island: string; towns: string[] }[];
};

export type Job = {
  id: string;
  title: string;
  description: string;
  region: string;
  town: string;
  created_at: string;
};

export type TownGroup = { town: string; jobs: Job[] };
export type RegionGroup = { region: string; towns: TownGroup[] };

export function groupJobsByRegion(jobs: Job[], regionsData: RegionsData): RegionGroup[] {
  const remaining = new Set(jobs);
  const groups: RegionGroup[] = [];

  for (const region of regionsData.regions) {
    const regionJobs = jobs.filter((job) => job.region === region.name);
    if (regionJobs.length === 0) continue;

    const towns: TownGroup[] = [];
    for (const town of region.towns) {
      const townJobs = regionJobs.filter((job) => job.town === town);
      if (townJobs.length === 0) continue;
      towns.push({ town, jobs: townJobs });
      townJobs.forEach((job) => remaining.delete(job));
    }

    // Jobs whose town isn't in this region's known list — keep them visible.
    const leftoverTowns = new Set(regionJobs.filter((job) => remaining.has(job)).map((job) => job.town));
    for (const town of leftoverTowns) {
      const townJobs = regionJobs.filter((job) => job.town === town && remaining.has(job));
      towns.push({ town, jobs: townJobs });
      townJobs.forEach((job) => remaining.delete(job));
    }

    groups.push({ region: region.name, towns });
  }

  // Jobs whose region isn't in nz-regions.json at all.
  if (remaining.size > 0) {
    const other = Array.from(remaining);
    const townNames = new Set(other.map((job) => job.town));
    const towns: TownGroup[] = Array.from(townNames).map((town) => ({
      town,
      jobs: other.filter((job) => job.town === town),
    }));
    groups.push({ region: "Other", towns });
  }

  return groups;
}
