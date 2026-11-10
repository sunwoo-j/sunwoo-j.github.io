(() => {
  'use strict';

  function mountGraph(graph) {
    const nodes = Array.from(graph.querySelectorAll('[data-graph-node]'), element => ({
      element,
      anchor: element.closest('.tool-node') || element,
      cluster: element.closest('.tool-cluster'),
      neighbors: [],
      x: 0, y: 0, dx: 0, dy: 0, scale: 1, influence: 0
    }));
    const byId = new Map(nodes.map(node => [node.element.dataset.graphNode, node]));
    const edges = [];
    for (const element of graph.querySelectorAll('[data-from]')) {
      const from = byId.get(element.dataset.from);
      const to = byId.get(element.dataset.to);
      if (!from || !to) continue;
      from.neighbors.push(to);
      to.neighbors.push(from);
      edges.push({ element, from, to });
    }
    const bridges = edges.filter(edge => edge.element.classList.contains('tool-bridge'));

    let pointer, hovered, focused, pinned, active;
    let drag;
    let suppressClick = false;
    let frame = 0;
    let previousTime = 0;
    let width, height;

    function withinGraph(delta, position, radius, size) {
      const minimum = Math.min(0, radius - position);
      const maximum = Math.max(0, size - radius - position);
      return Math.max(minimum, Math.min(maximum, delta));
    }

    function highlight() {
      const next = drag?.started ? drag.node : hovered || focused || pinned;
      if (active === next) return;

      active?.element.classList.remove('is-current');
      active = next;
      active?.element.classList.add('is-current');
      for (const node of nodes) node.influence = 0;

      // Let the motion travel across up to three links, losing strength at each step.
      let frontier = active ? [active] : [];
      for (const strength of [1, .84, .55, .3]) {
        const nextFrontier = [];
        for (const node of frontier) {
          if (node.influence) continue;
          node.influence = strength;
          nextFrontier.push(...node.neighbors);
        }
        frontier = nextFrontier;
      }

      for (const { element, from, to } of edges) {
        element.classList.toggle('is-related', from.influence > 0 && to.influence > 0);
        element.classList.toggle('is-incident', from === active || to === active);
      }
    }

    function render(blend, motionEnabled) {
      const origin = motionEnabled ? (hovered ? pointer : active) : null;
      const dragging = drag?.started ? drag : null;
      let moving = false;

      for (const node of nodes) {
        const grabbed = dragging?.node === node;
        const deltaX = origin ? origin.x - node.x : 0;
        const deltaY = origin ? origin.y - node.y : 0;
        const pull = node.influence * (node === active ? 7 : 18);
        const strength = pull / (45 + Math.hypot(deltaX, deltaY));
        const follow = grabbed ? 1 : motionEnabled ? node.influence * .36 : 0;
        const radius = node.radius * (grabbed ? 1.12 : 1.05);
        const targetX = dragging ? withinGraph(dragging.dx * follow, node.x, radius, width) : deltaX * strength;
        const targetY = dragging ? withinGraph(dragging.dy * follow, node.y, radius, height) : deltaY * strength;
        const targetScale = origin ? 1 + node.influence * (node === active ? .12 : .045) : 1;
        const settled = Math.abs(targetX - node.dx) < .1
          && Math.abs(targetY - node.dy) < .1
          && Math.abs(targetScale - node.scale) < .001;

        node.dx = settled || grabbed ? targetX : node.dx + (targetX - node.dx) * blend;
        node.dy = settled || grabbed ? targetY : node.dy + (targetY - node.dy) * blend;
        node.scale = settled ? targetScale : node.scale + (targetScale - node.scale) * blend;
        node.element.style.setProperty('--node-dx', `${node.dx.toFixed(2)}px`);
        node.element.style.setProperty('--node-dy', `${node.dy.toFixed(2)}px`);
        node.element.style.setProperty('--node-scale', node.scale.toFixed(3));
        moving ||= !settled;
      }

      for (const { element, from, to, bend } of edges) {
        const startX = from.x + from.dx;
        const startY = from.y + from.dy;
        const endX = to.x + to.dx;
        const endY = to.y + to.dy;
        if (bend) {
          const controlX = (startX + endX) / 2 + bend.x;
          const controlY = (startY + endY) / 2 + bend.y;
          element.setAttribute('d', `M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`);
        } else {
          element.setAttribute('x1', startX);
          element.setAttribute('y1', startY);
          element.setAttribute('x2', endX);
          element.setAttribute('y2', endY);
        }
      }
      return moving;
    }

    function animate(time) {
      const elapsed = previousTime ? time - previousTime : 16;
      previousTime = time;
      if (render(1 - Math.exp(-elapsed / 65), true)) {
        frame = requestAnimationFrame(animate);
      } else {
        frame = 0;
        previousTime = 0;
      }
    }

    function update() {
      highlight();
      if (document.documentElement.classList.contains('motion-off')) {
        cancelAnimationFrame(frame);
        frame = 0;
        previousTime = 0;
        render(1, false);
      } else if (!frame) {
        frame = requestAnimationFrame(animate);
      }
    }

    function layout() {
      for (const node of nodes) {
        node.x = node.cluster.offsetLeft + node.anchor.offsetLeft;
        node.y = node.cluster.offsetTop + node.anchor.offsetTop;
        node.radius = node.anchor.offsetWidth / 2;
      }
      width = graph.clientWidth;
      height = graph.clientHeight;
      for (const [index, bridge] of bridges.entries()) {
        const { from, to } = bridge;
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const distance = Math.hypot(dx, dy) || 1;
        const amount = Math.min(distance * .32, width * .27, 96);
        // Alternate vertical curves and bend horizontal curves toward the center rows.
        const direction = Math.abs(dx) < Math.abs(dy)
          ? (index % 2 === 0 ? 1 : -1)
          : (from.y + to.y < height ? 1 : -1);
        bridge.bend = { x: -dy * amount * direction / distance, y: dx * amount * direction / distance };
      }
      update();
    }

    function graphPoint(event) {
      const bounds = graph.getBoundingClientRect();
      return { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
    }

    graph.addEventListener('pointerdown', event => {
      if (!event.isPrimary || event.button !== 0 || drag) return;
      suppressClick = false;
      const button = event.target.closest('.tool-logo');
      if (!button) return;

      const node = byId.get(button.dataset.graphNode);
      const start = graphPoint(event);
      drag = {
        node, id: event.pointerId, start, started: false, dx: 0, dy: 0,
        grabX: start.x - node.x - node.dx,
        grabY: start.y - node.y - node.dy
      };
      button.setPointerCapture(event.pointerId);
    });

    function moveDrag(event) {
      const point = graphPoint(event);
      if (!drag.started) {
        if (Math.hypot(point.x - drag.start.x, point.y - drag.start.y) < 5) return;
        drag.started = true;
        hovered = null;
        focused = null;
        pinned?.element.setAttribute('aria-pressed', 'false');
        pinned = null;
        graph.classList.add('is-dragging');
      }
      const { node, grabX, grabY } = drag;
      drag.dx = withinGraph(point.x - grabX - node.x, node.x, node.radius * 1.12, width);
      drag.dy = withinGraph(point.y - grabY - node.y, node.y, node.radius * 1.12, height);
      update();
    }

    function finishDrag(event) {
      if (drag?.id !== event.pointerId) return;
      suppressClick = drag.started;
      drag = null;
      graph.classList.remove('is-dragging');
      update();
    }

    graph.addEventListener('pointerup', finishDrag);
    graph.addEventListener('pointercancel', finishDrag);
    graph.addEventListener('lostpointercapture', finishDrag);
    graph.addEventListener('pointermove', event => {
      if (drag?.id === event.pointerId) {
        moveDrag(event);
        return;
      }
      if (event.pointerType !== 'mouse') return;
      pointer = graphPoint(event);
      hovered = byId.get(event.target.closest('[data-graph-node]')?.dataset.graphNode);

      if (!hovered) {
        let nearestDistance = Infinity;
        for (const node of nodes) {
          const distance = Math.hypot(pointer.x - node.x - node.dx, pointer.y - node.y - node.dy);
          if (distance <= node.radius + 7 && distance < nearestDistance) {
            nearestDistance = distance;
            hovered = node;
          }
        }
      }
      update();
    });
    graph.addEventListener('pointerleave', () => {
      hovered = null;
      update();
    });
    graph.addEventListener('focusin', event => {
      if (!event.target.matches('.tool-logo:focus-visible')) return;
      focused = byId.get(event.target.dataset.graphNode);
      update();
    });
    graph.addEventListener('focusout', event => {
      if (focused?.element !== event.target) return;
      focused = null;
      update();
    });
    graph.addEventListener('click', event => {
      if (suppressClick && event.detail > 0) {
        suppressClick = false;
        return;
      }
      const button = event.target.closest('.tool-logo');
      const next = byId.get(button?.dataset.graphNode);
      pinned?.element.setAttribute('aria-pressed', 'false');
      pinned = next === pinned ? null : next;
      pinned?.element.setAttribute('aria-pressed', 'true');
      update();
    });

    const listeners = new AbortController();
    document.addEventListener('site-motion-change', update, { signal: listeners.signal });
    const resizeObserver = new ResizeObserver(layout);
    resizeObserver.observe(graph);
    layout();
    return () => {
      drag = null;
      listeners.abort();
      resizeObserver.disconnect();
      cancelAnimationFrame(frame);
    };
  }

  let unmount;
  function mountPage() {
    const graph = document.querySelector('.tool-graph');
    unmount = graph ? mountGraph(graph) : null;
  }
  document.addEventListener('site-page-leave', () => unmount?.());
  document.addEventListener('site-page-change', mountPage);
  mountPage();
})();
