import { Users } from 'lucide-react';

export default function AgentSelector({ agents, selectedAgent, onSelect }) {
  return (
    <div className="glass-panel agent-selector">
      <div className="agent-selector-title">
        <Users size={14} style={{ marginRight: 6, verticalAlign: -2 }} />
        Select Agent
      </div>
      <div className="agent-list">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className={`agent-card ${selectedAgent?.id === agent.id ? 'selected' : ''}`}
            onClick={() => onSelect(agent)}
          >
            <div className="agent-avatar" style={{ background: agent.color }}>
              {agent.avatar}
            </div>
            <div className="agent-info">
              <div className="agent-name">{agent.name}</div>
              <div className="agent-status">Active</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
