import { TABS, type TabId } from '@/components/brands/configTabs'

type Props = {
  activeTab: TabId
  onSelect: (tab: TabId) => void
}

export default function BrandTabs({ activeTab, onSelect }: Props) {
  return (
    <div className="tabs-wrap card">
      <div className="tabs tabs--large">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={activeTab === tab.id ? 'tabs__btn active' : 'tabs__btn'}
            onClick={() => onSelect(tab.id)}
          >
            <span>{tab.label}</span>
            <small>{tab.hint}</small>
          </button>
        ))}
      </div>
    </div>
  )
}
