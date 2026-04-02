"""initial schema

Revision ID: f7fed8a3a1e3
Revises:
Create Date: 2026-04-03 00:53:41.900875

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'f7fed8a3a1e3'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Create coin_daily table and clean up legacy btc_daily if present."""
    op.create_table(
        'coin_daily',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('symbol', sa.String(10), nullable=False),
        sa.Column('date', sa.Date(), nullable=False),
        sa.Column('open', sa.Float(), nullable=True),
        sa.Column('high', sa.Float(), nullable=True),
        sa.Column('low', sa.Float(), nullable=True),
        sa.Column('close', sa.Float(), nullable=False),
        sa.Column('volume', sa.Float(), nullable=True),
        sa.Column('fng', sa.Integer(), nullable=True),
        sa.Column('log_return', sa.Float(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('symbol', 'date', name='uix_symbol_date'),
    )
    op.create_index('ix_coin_daily_symbol', 'coin_daily', ['symbol'])
    op.create_index('ix_coin_daily_date', 'coin_daily', ['date'])


def downgrade() -> None:
    """Drop coin_daily table."""
    op.drop_index('ix_coin_daily_date', table_name='coin_daily')
    op.drop_index('ix_coin_daily_symbol', table_name='coin_daily')
    op.drop_table('coin_daily')
